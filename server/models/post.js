var mongoose = require('mongoose');

var postSchema = require('./schemas/postSchema');

var Post = mongoose.model('Post', postSchema);

module.exports = Post;
