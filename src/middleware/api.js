import express from 'express';
import Device from '../database/Device';
import DataEntry from '../database/DataEntry';

const app = express();

app.get('/data', async (req, res) => {
  const devices = (await Device.find().exec())
    .map(u => u.toObject());

  await Promise.all(devices.map(async (device) => {
    device.data = await Promise.all(device.dataTypes.map(async (dataType) => {
      const lastDataEntry = await DataEntry.findOne({
        device: device._id,
        data: {
          $elemMatch: {
            key: dataType.key,
          },
        },
      }).sort({ createdAt: -1 }).exec();
      if (lastDataEntry) {
        dataType.value = lastDataEntry.data.find(data => data.key === dataType.key).value;
        dataType.updatedAt = lastDataEntry.createdAt;
      }
      return dataType;
    }));
    delete device.dataTypes;
    delete device.token;
    delete device.__v;
    delete device.user;
  }));

  res.json({ devices });
});

app.post('/data', async (req, res) => {
  // Check if valid request
  if (typeof req.body.token !== 'string' || !Array.isArray(req.body.data) || req.body.data.length === 0) {
    return res.status(400).end();
  }

  // Find device
  const device = await Device.findOne({ token: req.body.token }).exec();
  if (!device) {
    return res.status(400).end();
  }

  for(var dataType of device.dataTypes){
    var input = req.body.data;
    var matchedDataType = input.find(function(item){
      return item.key === dataType.key;
    });

    var inputAccepted = true;
    
    switch(dataType.type) {
      case 'temperature':
      case 'humidity':
      case 'windforce':
      case 'number':
        inputAccepted = typeof(matchedDataType.value) === 'number';
        break;
      case 'boolean':
        inputAccepted = typeof(matchedDataType.value) === 'boolean';
        break;
      case 'text':
        inputAccepted = typeof(matchedDataType.value) === 'string';
        break;
    }

    if(!inputAccepted){
      console.log(matchedDataType, dataType)
      return res.status(400).send(dataType.key + " must be of type " + dataType.type);
    }
  };

  const dataEntry = new DataEntry({
    device: device.id,
    data: req.body.data,
  });

  await dataEntry.save();

  return res.status(200).end();
});

export default app;
