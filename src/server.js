import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';
import Device from './database/Device';
import DataEntry from './database/DataEntry';
import passport, { authenticated } from './passport';
import admin from './admin';

const MongoStore = connectMongo(session);

const app = express();
app.set('trust proxy');
app.use(session({
  secret: 'aisdfoyasudbv;aosdn',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.get('/', authenticated, async (req, res) => res.redirect('/admin'));

app.use('/admin', authenticated, admin);

export default app;
