import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';
import cors from 'cors';
import passport, { authenticated } from './middleware/passport';
import admin from './middleware/admin';
import api from './middleware/api';

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
app.use(cors());

app.use(passport);

app.use(api);

app.get('/', authenticated, async (req, res) => res.redirect('/admin'));

app.use('/admin', authenticated, admin);

export default app;
