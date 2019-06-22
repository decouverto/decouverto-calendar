
var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    title: String,
    type: String,
    start: Date,
    end: Date,
    can_subscribe: Boolean,
    location: {
        lat: Number,
        long: Number,
        name: String
    },
    description: String,
    number_limit: Number,
    is_located: Boolean,
    is_defined_end: Boolean,
    walk_id: String,
    emails: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Emails' }]
});
