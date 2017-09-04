import express from 'express';
import { Strategy } from 'passport-google-oauth20';
import passport from 'passport';
import User from './database/User';
import Device from './database/Device';
import session from 'express-session';
import DataEntry from './database/DataEntry';
import bodyParser from 'body-parser';

passport.use(
  new Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOneAndUpdate(
      {googleId: profile.id },
      {googleId: profile.id, name: profile.displayName},
      {upsert: true, new: true},
      cb,
    );
  },
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

const app = express();
app.set('trust proxy');
app.use(session({secret: 'aisdfoyasudbv;aosdn', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.get('/data', async (req,res) => {
  const devices = (await Device.find().exec())
    .map(u => u.toObject());

  await Promise.all(devices.map(async u => {
    u.data = u.dataTypes;
    delete u.dataTypes;
    delete u.token;
    const data = await DataEntry.findOne({device: u._id}).exec();
    u.data.forEach(dataType => {
      dataType.value = data.data.find(d => d.key === dataType.key).value;
    });
  }));

  res.json({devices});
});

app.post('/data', async (req, res) => {

  // Check if valid request
  if(typeof req.body.token !== 'string' || !Array.isArray(req.body.data) || req.body.data.length === 0){
    return res.status(400).end();
  }

  // Find device
  const device = await Device.findOne({token: req.body.token }).exec();
  if(!device){
    return res.status(400).end();
  }

  const dataEntry = new DataEntry({
    device: device.id,
    data: req.body.data
  });

  await dataEntry.save();

  return res.status(200).end();
});

app.use((req, res, next) => {
  if(!req.user) {
    return res.redirect('/auth/google');
  }
  next();
});

app.get('/', async ({ user }, res) => {
  const device = await Device.findOne({ user: user.id}).exec();
  res.send(`Hi ${user.name}! ${device ? `Your device ID is <code>${device.token}</code>` : 'Please refresh to see your Device ID'}`);
});

export default app;