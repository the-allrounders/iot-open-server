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

  device.dataTypes.map((dataType) => {
    var input = req.body.data;
    var foundDataTypes = input.filter(function(item){
      return item.key === dataType.key;
    });

    var inputAccepted = foundDataTypes.map((item) => {
      switch(dataType.type) {
        case 'temperature':
        case 'number':
        case 'humidity':
        case 'windforce':
          return typeof(item.value) === 'number' || typeof(item.value) === 'number';
        case 'boolean':
          return typeof(item.value) === 'boolean';
        case 'text':
          return typeof(item.value) === 'string';
      }
    });
  });

  const dataEntry = new DataEntry({
    device: device.id,
    data: req.body.data,
  });

  await dataEntry.save();

  return res.status(200).end();
});

export default app;
