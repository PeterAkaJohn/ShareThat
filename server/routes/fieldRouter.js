var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('../utils/verify');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var Fields = require('../models/field');

var fieldRouter = express.Router();

var router = function(){
  fieldRouter.use(bodyParser.json());

  fieldRouter.route('/')

  .get(function(req,res,next){//everyone
    Fields.find({}, function(err, field){
      if (err) {
        throw err;
      }
      res.json(field);
    });
  })

  .post(Verify.verifyAdmin, function(req, res, next){//admin not implemented immediately
    var newField = req.body;
    Fields.create(newField, function(err, field){
      if (err) {
        throw err;
      }
      console.log('New field created!');
      res.json(field);
    });
  })

  .delete(Verify.verifyAdmin, function(req,res,next){//admin not yet implemented
    FIelds.remove({}, function(err, resp){
      if (err) {
        throw err;
      }
      res.json(resp);
    });
  });

  fieldRouter.route('/limitedFields')

  .get(function(req,res,next){//everyone
    Fields.find({}).sort({createdAt: -1}).limit(12).exec(function(err, field){
      if (err) {
        throw err;
      }
      res.json(field);
    });
  });

  fieldRouter.route('/:fieldId')

  .get(function(req,res,next){
    Fields.findById(
      req.params.fieldId
    ).deepPopulate('posts tutorials posts.user tutorials.user').exec(function(err, field){
      if (err) {
        throw err;
      }
      res.json(field);
    });
  })

  .delete(Verify.verifyAdmin, function(req,res,next){ //if user and logged user match
    Fields.findById(
      req.params.fieldId
    , function(err, field){
      if (err) {
        throw err;
      }
      field.remove(function(err){
        if (err) {
          return next(err);
        }
        console.log('Field eliminated');
      });
    });
  });


  return fieldRouter;

}

module.exports = router;
