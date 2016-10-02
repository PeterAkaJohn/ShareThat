var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var FeedBack = require('../models/feedback');
var Verify = require('../utils/verify');

var feedbackRouter = express.Router();

var router = function(){
  feedbackRouter.use(bodyParser.json());

  feedbackRouter.route('/')

  .get(function(req, res, next){//admin
    FeedBack.find({}).populate('sentBy').exec(function(err, feedback){
      if (err) {
        throw err;
      }
      res.json(feedback);
    });
  })

  .post(function(req, res, next){//user
    var newFeedback = req.body;
    Feedback.create(newFeedback, function(err, feedback){
      if (err) {
        throw err;
      }
      console.log('New Feedback added');
    });
  })

  .delete(function(req, res, next){//admin
    Feedback.remove({}, function(err, resp){
      if (err) {
        throw err;
      }
      res.json(resp);
    });
  });

  feedbackRouter.route('/:feedbackId')

  .get(function(req, res, next){       //admin
    Feedback.findById(req.params.feedbackId).populate('sentBy').exec(function(err, feedback){
      if (err) {
        throw err;
      }
      res.json(feedback);
    });
  })

  .delete(function(req, res, next){ //admin
    Feedback.remove(req.params.feedbackId, function(err, resp){
      if (err) {
        throw err;
      }
      res.json(resp);
    });
  });

  return feedbackRouter;

}

module.exports = router;
