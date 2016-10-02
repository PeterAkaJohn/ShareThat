var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var fieldSchema = require('./schemas/fieldSchema');
fieldSchema.plugin(deepPopulate, {});
var Field = mongoose.model('Field', fieldSchema);

module.exports = Field;
