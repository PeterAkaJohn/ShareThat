var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var replyToCommentSchema = require('./replyToCommentSchema');

var replySchema = new Schema({
  rating:{
    type: Number,
    min:1,
    max:5
  },
  content: {
    type: String,
    required: true
  },
  replyToComment: [replyToCommentSchema],
  user: {
    type:mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type:String
  }
},{
  timestamps: true
});

module.exports = replySchema;
