var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('../utils/verify');

var Posts = require('../models/post');
var Fields = require('../models/field');
var Users = require('../models/user');
//var Authors = require('../models/user');

/* This is useful for infiniteScrolling
var lastSeen = null; // declare in a global or session or something

User.find({})
    .sort({ "_id": -1 })
    .limit(15)
    .exec(function(err,docs) {
        lastSeen = docs.slice(-1).id;
    });
And then:

User.find({ "_id": { "$lt": lastSeen })
    .sort({ "_id": -1 })
    .limit(15)
    .exec(function(err,docs) {
        lastSeen = docs.slice(-1).id;
    });

*/

var postRouter = express.Router();

var router = function(){
  postRouter.use(bodyParser.json());

  postRouter.route('/')

  .get(function(req, res, next){
    Posts.find({}).populate('user replies.user').sort({createdAt: -1}).exec(function(err, post){
      if (err) {
        throw err;
      }
      res.json(post);
    });
  })

  .post(Verify.verifyOrdinaryUser, function(req, res, next){ //normal user
    var newpost = req.body;
    newpost.user = req.decoded._id;

    //newpost.user = req.decoded._doc._id;
    Posts.create(newpost, function(err, post){
      if (err) {
        throw err;
      }
      console.log('post created!');
      var id = post._id;

      Fields.findOne(
        {name:newpost.field}
      ).exec(function(err, field){
        if (err) {
          throw err;
        };
        if (newpost.typeOfPost == 'Q') {
          field.posts.push(id);
        }
        else {
          field.tutorials.push(id);
        }
        field.save(function(err, field){
          if (err) {
            throw err;
          }
          console.log('Updated field '+field.name);

          Users.findById(
            req.decoded._id
          ).exec(function(err, user){
            if (err) {
              throw err;
            }
            user.posts.push(id);
            user.save(function(err, user){
              if (err) {
                throw err;
              }
              console.log('Added post id to user');
              var new_id = {
                content: id
              }
              res.json(new_id);
            });
          });
        });
      });
    })
  })

  .delete(Verify.verifyAdmin, function(req, res, next){ //admin
    Posts.remove({}, function(err, resp){
      if (err) {
        throw err;
      }
      res.json(resp);
    });
  });

  postRouter.route('/postQ') //this will retrieve all the questions

  .get(function(req, res, next){
    Posts.find({typeOfPost: 'Q'}).populate('user replies.user').sort({date: -1}).exec(function(err, post){
      if (err) {
        throw err;
      }
      res.json(post);
      });
    });

  postRouter.route('/postT') //this will retrieve all the tutorials

  .get(function(req, res, next){
    Posts.find({typeOfPost: 'T'}).populate('user replies.user').sort({date: -1}).exec(function(err, post){
      if (err){
        throw err;
      }
      res.json(post);
    })
  });

  postRouter.route('/infiniteScrolling')

  .get(function(req, res, next){
    var lastItemSeen = null || req.body._id;
    Posts.find({ "_id": { "$lt": lastItemSeen }})
        .sort({ "_id": -1 })
        .limit(15)
        .exec(function(err,post) {
          if(err){
            throw err;
          }
          lastItemSeen = post.slice(-1).id;
          res.json(post);
        });
  });

  postRouter.route('/latestPosts')

  .get(function(req, res, next){
    Posts.find({typeOfPost: 'Q'}).populate('user replies.user').sort({createdAt: -1}).limit(10).exec(function(err, post){
      if (err) {
        throw err;
      }
      res.json(post);
      });
  });

  postRouter.route('/latestTutorials')

  .get(function(req, res, next){
    Posts.find({typeOfPost: 'T'}).populate('user replies.user').sort({createdAt: -1}).limit(10).exec(function(err, post){
      if (err) {
        throw err;
      }
      res.json(post);
      });
  });

  postRouter.route('/add')

  .post(Verify.verifyOrdinaryUser, function(req, res, next){ //normal user
    var newpost = req.body;
    //newpost.user = req.decoded._doc._id;
    Posts.create(newpost, function(err, post){
      if (err) {
        throw err;
      }
      console.log('post created!');
      var id = post._id;

      Fields.findOne(
        {name:newpost.field}
      ).exec(function(err, field){
        if (err) {
          throw err;
        }
        field.posts.push(id);
        field.save(function(err, field){
          if (err) {
            throw err;
          }
          console.log('Updated field '+field.name);

        });
      });

      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });

      res.end('Added the post with id: ' + id);
    })
  });

  postRouter.route('/:postId')

  .get(function(req, res, next){//everyone
    Posts.findById(req.params.postId).populate('user replies replies.user').exec(function(err, post){
      if (err) {
        throw err;
      }
      res.json(post);
    });
  })

  .delete(Verify.verifyOrdinaryUser, function(req, res, next){ //admin
    Users.findById(req.decoded._id).exec(function(err,user){
      if (err) {
        throw err;
      }
      Posts.findById(req.params.postId).exec(function(err, post){
        if (err) {
          throw err;
        }
        console.log(post);
        if (post.user == req.decoded._id || req.decoded.admin) {
          var indexPost = user.posts.indexOf(req.params.postId);
          user.posts.splice(indexPost, 1);
          user.save(function(err, user){
            if (err) {
              throw err;
            }
            console.log('removed post id to user');
            post.remove(function(err, postR){
              if (err) {
                throw err;
              }
              res.json(postR);
            });
          });


        } else {
          console.log('Not same user');
        }
      });
    })

    /*Posts.remove(req.params.postId, function(err, resp){
      if (err) {
        throw err;
      }
      res.json(resp);
    });*/
  })

  .put(Verify.verifyOrdinaryUser, function(req, res, next) {
    console.log(req.body);
    Posts.findByIdAndUpdate(req.params.postId, {
      $set: req.body
    }, {
      new: true
    }, function(err, post) {
      if (err) {
        throw err;
      }
      res.json(post);
    });
  });

  postRouter.route('/:postId/replies')

  .get(function(req, res, bext){//everyone
    Posts.findById(req.params.postId).populate('user replies.user').exec(function(err, post){
      if (err) {
        throw err;
      }
      res.json(post.replies);
    });
  })

  .post(Verify.verifyOrdinaryUser, function(req, res, next){//user
    Posts.findById(req.params.postId, function(err, post){
      if (err) {
        throw err;
      }

      req.body.user = req.decoded._id;
      post.replies.push(req.body);
      post.save(function(err, post){
        if (err) {
          throw err;
        }
        Users.findById(
          req.decoded._id
        ).exec(function(err, user){
          if (err) {
            throw err;
          }
          user.replies.push(req.body);
          user.save(function(err, user){
            if (err) {
              throw err;
            }
            console.log('Added reply to user');
          });
        });
        console.log('Updated replies');
        res.json(post);
      });
    });
  })

  .delete(Verify.verifyAdmin, function(req, res, next){//admin
    Posts.findById(req.params.postId, function(err, post){
      if (err) {
        throw err;
      }
      for (var i = (post.replies.length - 1); i >= 0; i--) {
        post.replies.id(post.replies[i]._id).remove();
      }
      post.save(function(err, result){
        if (err) {
          throw err;
        }
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        res.end('Deleted all replies!');
      });
    });
  });

  postRouter.route('/:postId/replies/:replyId')

  .get(function(req, res, next){//everyone
    Posts.findById(req.params.postId).populate('author replies.postedBy').exec(function(err, post){
      if (err) {
        throw err;
      }
      res.json(post.replies.id(req.params.replyId));
    });
  })

  .put(Verify.verifyOrdinaryUser, function(req, res, next) {//admin or user that owns it
    // We delete the existing commment and insert the updated
    // reply as a new reply
    req.body.user = req.decoded._id;
    var updatedReply = req.body;
    Posts.findById(req.params.postId, function(err, post) {
      if (err) throw err;
      post.replies.id(req.params.replyId) = updatedReply;
      post.save(function(err, post) {
        if (err) throw err;
        console.log('Updated replies!');
        res.json(post);
      });
    });
  })

  .delete(Verify.verifyOrdinaryUser, function(req, res, next){//admin or user that owns it
    Posts.findById(req.params.postId, function(err, post){
      if (post.replies.id(req.params.postId).user != req.decoded._doc._id) {
        var err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        return next(err);
      }
      post.replies.id(req.params.replyId).remove();
      post.save(function(err, resp){
        if (err) {
          throw err;
        }
        res.json(resp);
      });
    });
  });

  return postRouter;

}

module.exports = router;
