var mongoose = require('mongoose');

var ownerSchema = require('./schemas/ownerSchema')

var Owners = mongoose.model('Owner', ownerSchema);
module.exports = Owners;
