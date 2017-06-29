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

//----------------------------------------------------------------------
module.exports = router;
