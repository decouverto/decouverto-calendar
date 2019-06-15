
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
    emails: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Email' }]
});

/* TODO: add link to Découverto walk */