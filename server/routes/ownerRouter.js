var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('../utils/verify');

var Owners = require('../models/owner');

var ownerRouter = express.Router();

var router = function(){
  ownerRouter.use(bodyParser.json());

  ownerRouter.route('/')

  .get(function(req,res,next){//everyone
    Owners.find({}, function(err, owner){
      if (err) {
        throw err;
      }
      res.json(owner);
    });
  })

  .post(function(req, res, next){//admin
    var newOwner = req.body;
    Owners.create(newOwner, function(err, owner){
      if (err) {
        throw err;
      }
      console.log('New Owner created!');
    });
  })

  .delete(function(req, res, next){ //admin
    Owners.remove({}, function(err, resp){
      if (err) {
        throw err;
      }
      res.json(resp);
    });
  });

  return ownerRouter;
}

module.exports = router;
