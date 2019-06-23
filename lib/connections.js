var mongoose = require('mongoose');
var connection = mongoose.createConnection('mongodb://localhost:27017/decouverto-calendar', { useNewUrlParser: true });

var eventSchema = require('../schemas/event.js');
var emailSchema = require('../schemas/email.js');


var Events = connection.model('Events', eventSchema);
var Emails = connection.model('Emails', emailSchema);

module.exports = {Events, Emails}