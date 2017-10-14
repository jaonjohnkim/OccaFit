var express = require('express');
var router = express.Router();
var db = require('../database/index.js');
var bodyParser = require('body-parser');

router.use(bodyParser.json());

router.get('/', (req, res) => {
  console.log('First Check Auth', req);
  if (req.user) {
    res.json({user: req.user, cookie: req.cookies, sessionID: req.sessionID, query: 0, _query: 0});
  } else {
    res.json({});
  }
})

// grabs About Me info for the profile page
router.get('/about', (req, res) => {
  // get user id from the req
  var id = req.headers.user;

  db.getAboutMe(id, (err, result) => {
    if (err) {
      console.err('err getting about me info', err)
    } else {
      console.log(result)
      res.send(result)
    }
  })
})

router.get('/activities', (req, res) => {
  // Get all of this user's data
  // Get all of the upcoming events for this user also
  // Display them in chronological order
  db.getUserPostings(req.headers.user, (err, userPosts) => {
    if (err) {
      res.status(401);
    } else {
      db.getUserAcceptPostings(req.headers.user, (err, acceptedPosts) => {
        if (err) {
          res.status(401);
        } else {
          var activities = {
            hosted: userPosts,
            attended: acceptedPosts
          };
          res.send(activities);
        }
      })
    }
  })
  //
  // db.getUserAcceptPostings()
})

router.post('/', (req, res) => {

  //console.log('user from request', req.session.passport.user);
  var id = req.session.passport.user;
  var profileObj = {
    gender: req.body.gender,
    activity: req.body.activity,
    userId: id
  };

  db.createProfile(profileObj, (err, result) => {
    //console.log('created profile');
    if (err) {
      res.status(401)
    } else {
      res.redirect('/postings');
    }
  });
});

router.get('/relationship', (req, res) => {
  var currentUser = req.headers.currentuser;
  var otherUser = req.headers.otheruser;
  if (currentUser !== otherUser) {
    db.checkFriendStatus(currentUser, otherUser, (err, data) => {
      if (err) {
        res.status(401);
      } else {
        res.send(data);
      }
    });
  }
});

router.patch('/accept', (req, res) => {
  db.acceptFriendRequest(req.body.user1.userOneId, req.body.user2.id, (err, data) => {
    if (err) {
      res.status(401);
    } else {
      res.send(data);
    }
  });
});

router.patch('/decline', (req, res) => {
   console.log('INSIDE Decline:', req.body);
   db.declineFriendRequest(req.body.user1.userOneId, req.body.user2.id, (err, data) => {
     if (err) {
       res.status(401);
     } else {
       res.send(data);
     }
   });
});

router.get('/friends', (req, res) => {
  //Send back user data of the current users friends
  var userId = req.headers.user
  db.friendList(userId, (err, result)=> {
    if (err) {
      res.status(401);
    } else {
      Promise.all(result.map(function(el) {
          return new Promise ((resolve, reject) => {
            var id = el.userOneId;
            db.findById(id, (err, result) => {
              if(err) {
                reject(err);
              }else {
                resolve(result);
              }
            });
          })
      })).then(result => {

        res.send(result);
      })
    }

  })
});

router.post('/friends', (req, res) => {
  db.friendRequest(req.body.currentUser, req.body.otherUser, (err, data) => {
    if (err) {
      res.status(401);
    } else {
      res.send(data);
    }
  });
});

router.get('/getProfileImage',(req,res) => {
  var id = req.session.passport.user;
  db.getImage(id, function(err, result){
     if (err) {
      console.log('ERROR:', err);
    } else {
      res.send(result);
    }
  })
 
  
});

router.get('/:id', (req, res) => {
  // res.send('RENDER profile page');
  // console.log('user profile', req.user);
  db.findById(req.params.id, function(err, data) {
    if (err) {
      console.log('ERROR:', err);
    } else {
      res.send(data);
    }
  })
});

router.post('/uploadImage', (req,res) => {
  var id = req.session.passport.user;
  var url = req.body.url
  console.log("SERVER URLNEW IMAGE", url)
  db.addImage(url, id, function(err, result){
     if (err) {
      console.log('ERROR:', err);
    } else {
      res.send(result);
    }
  })
  
});





module.exports = router;
