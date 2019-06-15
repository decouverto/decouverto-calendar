
var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    mail: String,
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
});