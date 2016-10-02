var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var User = require('../models/user');
var Verify = require('../utils/verify');

var userRouter = express.Router();

var router = function(){
  userRouter.use(bodyParser.json());

  userRouter.route('/')

  .get(Verify.verifyAdmin, function(req, res, next) { //admin
    User.find({}).populate('posts').exec(function(err, user){
      if (err) {
        throw err;
      }
      res.json(user);
    })
  });


  userRouter.route('/register')

  .post(function(req, res){ //all
    User.register(new User({username: req.body.username}),
    req.body.password, function(err, user){
      if(err){
        return res.status(500).json({err:err});
      }
      if (req.body.firstname) {
        user.firstname = req.body.firstname;
      }
      if (req.body.lastname) {
        user.lastname = req.body.lastname;
      }
      user.save(function(err, user){
        passport.authenticate('local')(req, res, function(){
          return res.status(200).json({status: 'Registration Successfull!'});
        });
      });
    });
  });

  userRouter.route('/login')

  .post(function(req,res, next){ //registered user
    passport.authenticate('local', function(err, user, info){
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({
          err: info
        });
      }
      req.logIn(user, function(err){
        if (err) {
          return res.status(500).json({
            err: 'Could not log in user'
          });
        }

        console.log('User in users: ', user);

        var token = Verify.getToken({"username":user.username, "_id":user._id, "admin":user.admin});

        res.status(200).json({
          status: 'Login successfull',
          success: true,
          token: token
        });

      });
    })(req, res, next);
  });

  userRouter.route('/logout')

  .get(function(req, res){ //users
    req.logout();
    res.status(200).json({
      status: 'Bye!'
    });
  });

  userRouter.route('/loggeduser')

  .get(Verify.verifyOrdinaryUser, function(req, res, next){ //everyone
    User.findById(
      req.decoded._id
    ).populate('posts replies').exec(function(err, user){
      if (err) {
        throw err;
      }
      res.json(user);
    });
  })

  .put(Verify.verifyOrdinaryUser, function(req, res, next){ //everyone
    User.findByIdAndUpdate(req.decoded._id, {
      $set: req.body
    }, {
      new: true
    }, function(err, user) {
      if (err) {
        throw err;
      }
      res.json(user);
    });
  })

  ;


  userRouter.route('/:userId')

  .get(function(req, res, next){ //everyone
    User.findById(
      req.params.userId
    ).populate('posts').exec(function(err, user){
      if (err) {
        throw err;
      }
      res.json(user);
    });
  })

  .delete(Verify.verifyOrdinaryUser,function(req,res,next){ //if user and logged user match
    User.findById(
      req.decoded._id
    , function(err, user){
      if (err) {
        throw err;
      }
      user.remove(function(err){
        if (err) {
          return next(err);
        }
        console.log('User eliminated');
      });
    });
  });


  return userRouter;
}

module.exports = router;
