const express = require("express");

const bcrypt = require("bcrypt");

const UserModel = require('../models/user-model.js');

const router = express.Router();

// SIGNUP GET ROUTE ---------------------------------------------------
router.get("/signup", (req,res,next) => {
  res.render("auth-views/signup-view.ejs");
});

// SIGNUP POST ROUTE --------------------------------------------------
router.post("/signup", (req, res, next) => {
  // If username or password is empty, show error message
  if(req.body.signupUsername === "" || req.body.signupPassword === "") {
    res.locals.messageForDumbUsers = "Please provide both username and password";
    res.render("auth-views/signup-view.ejs");
    return;
  }

// this looks in the database if there is already someone with that username
  UserModel.findOne(
    {username: req.body.signupUsername},

    (err, userFromDb) => {
      if (userFromDb) {
        // If that's the case, display an error to the user
        res.locals.messageForDumbUsers = "Sorry, but that username is taken.";

        res.render("auth-views/signup-view.ejs");
        return;
      }

      // If we get here, we are ready to save the new user in the DB
      const salt = bcrypt.genSaltSync(10);
      const scrambledPassword = bcrypt.hashSync(req.body.signupPassword, salt);

      const theUser = new UserModel ({
        fullname: req.body.signupFullName,
        username: req.body.signupUsername,
        encryptedPassword: scrambledPassword
      });

      theUser.save((err) => {
        if (err) {
          next (err);
          return;
        }
        //
        res.redirect("/");
      });
    });
});

// END REGISTRATION -------------------------------------------------------


const passport = require("passport");

// LOG IN -----------------------------------------------------------------

router.get("/login", (req, res, next) => {
  // Redirect to home page if you are already logged in
  if (req.user) {
    res.redirect("/");
  }
  // If not logged in, show the log in page
  else {
  res.render("auth-views/login-view.ejs");
}
});

router.post("/login", passport.authenticate (
  "local", // 1st argument -> name of the strategy
                // determined by the strategy's npm package

{                 // 2nd argument -> settings object
  successRedirect: "/", // Where to go if login is SUCCESS
  failureRedirect: "/login" // Where to go if login FAILED

}
));

//END LOG IN --------------------------------------------------------------
router.get("/logout", (req, res, next) => {
  // req.logout works only because passport middleware is set up in app.js
  req.logout();
  res.redirect("/");
});


// SOCIAL LOGINS ---------------------------------------------------------

// FACEBOOK -------------------------------------------------------
                                      // Determined by the strategy npm package
router.get("/auth/facebook", passport.authenticate("facebook"));
              //  |
        // Go here to login in facebook
router.get("/auth/facebook/callback",
  passport.authenticate(
    "facebook",       // 1st arg -> name of the strategy
    {                 // 2nd arg -> settings object
      successRedirect: "/special",
      failureRedirect: "/login",
    }
  ));

  // GOOGLE ------------------------------------------------------

  // Determined by the strategy npm package
router.get("/auth/google",
    passport.authenticate(
      "google",
      {
        scope: [
          "https://www.googleapis.com/auth/plus.login",
          "https://www.googleapis.com/auth/plus.profile.emails.read"
        ]
      }
    ));
                    //  |
                    // Go here to login in Google
router.get("/auth/google/callback",
passport.authenticate(
"google",       // 1st arg -> name of the strategy
{                 // 2nd arg -> settings object
successRedirect: "/special",
failureRedirect: "/login",
}
));

// END SOCIAL LOGINS -----------------------------------------------------


module.exports = router;
