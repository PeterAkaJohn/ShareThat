var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var replySchema = require('./replySchema');

var User = new Schema({
    username: {
      type:String,
      unique: true
    },
    password: String,
    OauthId: String,
    OauthToken: String,
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    replies: [replySchema],
    rating: {
        type: Number
    }
}, {
    timestamps: true
});

module.exports = User;
