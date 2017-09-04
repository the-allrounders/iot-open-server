import express from 'express';
import passport from 'passport';
import User from './database/User';
import { Strategy } from 'passport-google-oauth20';

const middleware = express();

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

middleware.use(passport.initialize());
middleware.use(passport.session());

middleware.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

middleware.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

const authenticated = (req, res, next) => {
  if(!req.user) {
    return res.redirect('/auth/google');
  }
  next();
};

export default middleware;
export { authenticated };