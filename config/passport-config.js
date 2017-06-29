// We are configuring Passport in a seperate file to avoid
// making a mess in "app.js"

const passport = require("passport");
const bcrypt = require("bcrypt");

const UserModel = require("../models/user-model.js");

// serializeUser (controls what goes inside the bowl)

//deserializeUser (controls what you get when you check the bowl)


// STRATEGIES (different ways of logging into our app)----------

// SETUP passport-local (log in with username and password from a form)
const LocalStrategy = require("passport-local").Strategy;

passport.use(new LocalStrategy (
  {                        // 1st arg -> settings object
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
  }
);

      // #2 If there is a user with that username, is the PASSWORD correct?
    if (bcrypt.compareSync(formPassword, userFromDb.encryptedPassword) === false) {
          next(null, false);
    }

    // If we pass those if statements, LOGIN SUCCESS!
    next(null, userFromDb);
    // In Passport, if you call next() with a user in the 2nd position
    // that means LOGIN SUCCESS!!
}
));
