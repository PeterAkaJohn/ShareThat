var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var replySchema = require('./replySchema')

var postSchema = new Schema({
  rating:{
    type: Number,
    min:1,
    max:5
  },
  content: {
    type: String,
    required: true
  },
  title:{
    type: String,
    required: true
  },
  field:{
    type:String,
    required: true
  },
  user: {
    type:mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  typeOfPost:{
    type:String,
    required: true
  },
  replies:[replySchema]
},{
  timestamps: true
});

module.exports = postSchema;
