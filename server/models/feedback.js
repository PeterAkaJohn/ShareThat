var mongoose = require('mongoose');

var feedbackSchema = require('./schemas/feedbackSchema');

var Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
