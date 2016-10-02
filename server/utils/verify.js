var User = require('../models/user');
var jwt = require('jsonwebtoken');

var config = require('../config.js');

exports.getToken = function(user){
  return jwt.sign(user, config.secretKey,{
    expiresIn: 3600
  });
};

exports.verifyOrdinaryUser = function(req, res, next){

  //check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  //decode token
  if (token) {
    jwt.verify(token, config.secretKey, function(err, decoded){
      if (err) {
        var err = new Error('You are not authenticated!');
        err.status = 401;
        return next(err);
      }
      else {
        //save token if everything is checked and validated
        req.decoded = decoded;
        next();
      }
    });
  }
  else {
    //if there is no token, return an Error
    var err = new Error('No token provided!');
    err.status = 403;
    return next(err);
  }
};

exports.verifyAdmin = function(req, res, next){
  //check token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, config.secretKey, function(err, decoded){
      if (err) {
        var err = new Error('You are not authenticated!');
        err.status = 401;
        return next(err);
      }
      else {
        //save token if everything is checked and validated
        req.decoded = decoded;
        if(req.decoded.admin == true){
          next();
        }
        else {
          var err = new Error( "You are not authorized to perform this operation!");
          err.status = 403;
          return next(err);
        }
      }
    });
  }
  else {
    //if there is no token, return an Error
    var err = new Error('No token provided!');
    err.status = 403;
    return next(err);
  }
};
