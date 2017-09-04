import express from 'express';
import Device from './database/Device';
import session from 'express-session';
import DataEntry from './database/DataEntry';
import bodyParser from 'body-parser';
import passport, { authenticated } from './passport';

const app = express();
app.set('trust proxy');
app.use(session({ secret: 'aisdfoyasudbv;aosdn', resave: false, saveUninitialized: false }));
app.use(bodyParser.json());

app.use(passport);

app.get('/data', async (req, res) => {
  const devices = (await Device.find().exec())
    .map(u => u.toObject());

  await Promise.all(devices.map(async (u) => {
    u.data = u.dataTypes;
    delete u.dataTypes;
    delete u.token;
    const data = await DataEntry.findOne({ device: u._id }).exec();
    if (data) {
      u.data.forEach((dataType) => {
        dataType.value = data.data.find(d => d.key === dataType.key).value;
      });
    }
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

  const dataEntry = new DataEntry({
    device: device.id,
    data: req.body.data,
  });

  await dataEntry.save();

  return res.status(200).end();
});

app.get('/', authenticated, async ({ user }, res) => {
  const device = await Device.findOne({ user: user.id }).exec();
  res.send(`Hi ${user.name}! ${device ? `Your device ID is <code>${device.token}</code>` : 'Please refresh to see your Device ID'}`);
});

export default app;
