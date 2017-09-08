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

app.get('/data/:deviceId/:key', async (req, res) => {
  const dataEntries = await DataEntry
    .find({
      device: req.params.deviceId,
      data: {
        $elemMatch: {
          key: req.params.key,
        },
      },
    })
    .sort({ createdAt: -1 })
    .exec();

  res.json(dataEntries
    .map(({ _id, createdAt, data }) => ({
      _id,
      createdAt,
      value: data.find(d => d.key === req.params.key).value,
    })));
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

  const dataEntry = new DataEntry({
    device: device.id,
    data: req.body.data,
  });

  await dataEntry.save();

  return res.status(200).end();
});

export default app;
