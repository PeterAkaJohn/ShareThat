var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('../utils/verify');

var Posts = require('../models/post');
var Verify = require('../utils/verify');
//var Sort = require('../utils/sort');

var indexRouter = express.Router();

/* GET home page. */ //will send all data for now, later i will send only the top 5 stories and author
var router = function(){
  indexRouter.use(bodyParser.json());

  indexRouter.route('/')

  .get(function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });


  return indexRouter;
}

module.exports = router;
