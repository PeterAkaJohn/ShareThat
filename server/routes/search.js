var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('../utils/verify');

var Posts = require('../models/post');
//var Verify = require('../utils/verify');
//var Sort = require('../utils/sort');

var searchRouter = express.Router();

var currentSearch = '';


/* GET home page. */ //will send all data for now, later i will send only the top 5 stories and author
var router = function(){
  searchRouter.use(bodyParser.json());

  searchRouter.route('/')

  .post(function(req, res, next){

    var newSearch;

    if(req.body.content == '') {
      newSearch = currentSearch;
    }else{
      currentSearch = req.body.content;
      newSearch = req.body.content;
    }

    console.log(newSearch);

    Posts.find({}).or([{'title':{$regex: newSearch}}]).or([{'content':{$regex: newSearch}}]).populate('user replies.user').or([{'user.username': {$regex: newSearch}}]).sort({title: -1}).limit(50).exec(function(err, post){
      if (err) {
        throw err;
      }
      res.json(post);
      });
    });

  return searchRouter;
}

module.exports = router;
