var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var User = require('./schemas/userSchema');

User.methods.getName = function(){
  return(this.firstname + ' '+this.lastname);
};

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
