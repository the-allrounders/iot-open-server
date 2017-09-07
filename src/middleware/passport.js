import express from 'express';
import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import User from '../database/User';

const middleware = express();

passport.use(
  new Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
  },
    ((accessToken, refreshToken, profile, cb) => {
      User.findOneAndUpdate(
        { googleId: profile.id },
        { googleId: profile.id, name: profile.displayName },
        { upsert: true, new: true },
        cb,
      );
    }),
  ));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

middleware.use(passport.initialize());
middleware.use(passport.session());

middleware.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

middleware.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

const authenticated = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/auth/google');
  }
  return next();
};

export default middleware;
export { authenticated };
