var express = require('express');
var router = express.Router();
var db = require('../database/index.js');


router.get('/', (req, res) => {
  // res.send('RENDER profile page');
  console.log('user profile', req.user);
  if (req.user) {
    res.json(req.user);
  } else {
    res.json({});
  }
});

// grabs About Me info for the profile page
router.get('/about', (req, res) => {
  console.log('in the PROFILE ROUTER')
  // get user id from the req
  var id = req.user.id;
  db.getAboutMe(id, (result) => {
    console.log('about to send response')
    res.send(result[0])
  })
})

router.post('/', (req, res) => {

  //console.log('user from request', req.session.passport.user);
  var id = req.session.passport.user;
  var profileObj = {
    gender: req.body.gender,
    activity: req.body.activity,
    userId: id
  };

  db.createProfile(profileObj, (result) => {
    //console.log('created profile');

    res.redirect('/postings');
  });
});

module.exports = router;
