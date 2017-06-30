const express = require('express');
const router  = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  // If the user is not logged in, req.user will be empty.

  // Check if the user IS logged in
  if (req.user) {
    res.locals.currentUser = req.user;
  }
  res.render('index');
});

module.exports = router;
