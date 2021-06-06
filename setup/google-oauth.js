const passport = require("passport");
require("dotenv").config();
const config = require("config");

var GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/google-models");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: config.get("google.clientID"),
      clientSecret: config.get("google.clientSecret"),
      callbackURL: "http://localhost:3000/google/redirect",
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({ googleId: profile.id }).then(currentUser => {
        if (currentUser) {
          done(null, currentUser);
        } else {
          new User({
            googleId: profile.id,
            username: profile.displayName,
          })
            .save()
            .then(newUser => {
              done(null, newUser);
            });
        }
      });
    }
  )
);
