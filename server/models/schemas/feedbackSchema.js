var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var feedbackSchema = new Schema({
  sentBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  content: {
    type:String,
    required: true
  },
  senderEmail:{
    type:String,
    required: true
  }
},
{
  timestamps:true
});

module.exports = feedbackSchema;
