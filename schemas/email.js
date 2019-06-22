
var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    email: String,
    name: String,
    firstname: String,
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Events' },
});