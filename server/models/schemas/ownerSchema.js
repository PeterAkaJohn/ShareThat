var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ownerSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  image:{
    type: String,
    default: ""
  },
  description:{
    type: String,
    required: true
  },
  designation:{
    type: String,
    required: true
  }
},{
  timestamps: true
});

module.exports = ownerSchema;
