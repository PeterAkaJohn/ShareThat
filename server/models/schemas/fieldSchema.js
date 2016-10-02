var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fieldSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  posts: [{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  tutorials: [{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }]
},{
  timestamps: true
});

module.exports = fieldSchema;
