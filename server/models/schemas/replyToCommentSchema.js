var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var replyToCommentSchema = new Schema({
  comment: {
    type: String,
    required: true
  },
  user: {
    type:mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
},{
  timestamps: true
});

module.exports = replyToCommentSchema;
