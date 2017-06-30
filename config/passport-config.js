// We are configuring Passport in a seperate file to avoid
// making a mess in "app.js"

const passport = require("passport");
const bcrypt = require("bcrypt");

const UserModel = require("../models/user-model.js");

// serializeUser (controls what goes inside the bowl)
//  - save only the users database ID in the bowl
//  - happens ONLY when you log in
passport.serializeUser((userFromDb, next) => {
  next(null, userFromDb._id);
});

//deserializeUser (controls what you get when you check the bowl)
//  - use the ID in the bowl to retrieve the users information
//  - happens every time you visit any page the site after logging in
passport.deserializeUser((idFromBowl, next) => {
  UserModel.findById(
    idFromBowl,
    (err, userFromDb) => {
      if (err) {
        next(err);
        return;
      }
      // Tell passport that we got the user's info from the DB
      next(null, userFromDb);
      // null in 1st argument, means no error!
    }
  );
});

// STRATEGIES (different ways of logging into our app)----------

// SETUP passport-local (log in with username and password from a form)
const LocalStrategy = require("passport-local").Strategy;

passport.use(new LocalStrategy (
  {                                     // 1st arg -> settings object
    usernameField: "loginUsername",
    passwordField: "loginPassword"
  },
    // 2nd arg -> callback (will be called when a user tries to log in )
(formUsername, formPassword, next) => {
// #1 Is there an account with the provided username?
//    Is there a user with that username in the database?
UserModel.findOne(
  { username : formUsername},
  (err, userFromDb) => {
    if (err) {
      next(err);
      return;
    }
    if (userFromDb === null) {
      // In Passport, if you call next() with "false" in 2nd position,
      // that means LOGIN FAILED.
      next(null, false);
      return;
    }

    // #2 If there is a user with that username, is the PASSWORD correct?
  if (bcrypt.compareSync(formPassword, userFromDb.encryptedPassword) === false) {
        next(null, false);
  }
  // If we pass those if statements, LOGIN SUCCESS!
  next(null, userFromDb);
  // In Passport, if you call next() with a user in the 2nd position
  // that means LOGIN SUCCESS!!
  }
);


}
));

// PASSPORT - FACEBOOK (log in with your Facebook account) ----------------
const FbStrategy = require ('passport-facebook').Strategy;

passport.use(new FbStrategy(
  {     // 2st arg -> settings object
    clientID: "1588125127867180",
    clientSecret: "b15dc74c823bd648e879e4f2f8f4aab7",
    callbackURL: '/auth/facebook/callback'
  },                // our route (name this whatever you want)

(accessToken, refreshToken, profile, next) => {   // 2nd arg -> callback
          // (will be called when a user allows us to log them in with FB)
    console.log("");
    console.log("------FACEBOOK PROFILE INFO------");
    console.log(profile);
    console.log("");

    UserModel.findOne(
    {facebookId : profile.id},
    (err, userFromDb) => {
      // "userFromDb" will be empty If this is the first time
      // the user logs in with Facebook

      // Check if they have logged in before
      if (userFromDb) {
      // If they have, just log them in.
        next(null, userFromDb);
        return;
      }

      // If this is the first time, save them in the Database!
      const theUser = new UserModel({
        fullName: profile.displayName,
        facebookId: profile.id
      });
      theUser.save((err) => {
        if (err) {
          next(err);
          return;
        }
        next(null, theUser);
      });
    }
  );
  }
));

// PASSPORT - GOOGLE (log in with your GOOGLE account) ----------------
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

passport.use(new GoogleStrategy(
  {     // 2st arg -> settings object
    clientID: "GET CREDENTIALS",
    clientSecret: "GET CREDENTIALS",
    callbackURL: '/auth/google/callback'
  },                // our route (name this whatever you want)

(accessToken, refreshToken, profile, next) => {   // 2nd arg -> callback
          // (will be called when a user allows us to log them in with FB)
    console.log("");
    console.log("------GOOGLE PROFILE INFO------");
    console.log(profile);
    console.log("");

    UserModel.findOne(
    {googleId : profile.id},
    (err, userFromDb) => {
      // "userFromDb" will be empty If this is the first time
      // the user logs in with Facebook

      // Check if they have logged in before
      if (userFromDb) {
      // If they have, just log them in.
        next(null, userFromDb);
        return;
      }

      // If this is the first time, save them in the Database!
      const theUser = new UserModel({
        fullName: profile.displayName,
        googleId: profile.id
      });

      if (theUser.fullName === undefined) {
        theUser.fullName = profile.emails[0].value;
      }
      theUser.save((err) => {
        if (err) {
          next(err);
          return;
        }
        next(null, theUser);
      });
    }
  );
  }
));
