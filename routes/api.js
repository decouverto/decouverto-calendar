
var express = require('express');
var router = express.Router();
var auth = require('../policies/auth.js');
var eventSchema = require('../schemas/event.js');
var emailSchema = require('../schemas/email.js');


var mongoose = require('mongoose');
var connection = mongoose.createConnection('mongodb://localhost:27017/decouverto-calendar', { useNewUrlParser: true });

var Events = connection.model('Events', eventSchema);
var Emails = connection.model('Emails', emailSchema);

router.get('/events/', function (req, res) {
    Events.find(function (err, events) {
        if (err) {
            res.send(err);
        }
        res.json(events);
    });
})

router.post('/events/', function (req, res) {
    var event = new Events();

    event.title = req.body.title;
    event.type = req.body.type;
    event.start = req.body.start;
    event.end = req.body.end;
    event.can_subscribe = req.body.can_subscribe;
    event.location = {
        lat: req.body.lat,
        long: req.body.long,
        name: req.body.location_name
    };
    event.description = req.body.description;
    event.number_limit = req.body.number_limit;

    event.save(function (err) {
        if (err) {
            res.send(err);
        }
        res.json(event);
    });
});

router.get('/events/:id', function (req, res) {
    Events.findById(req.params.id, function (err, event) {
        if (err) res.send(err);
        res.json(event);
    });
})
router.put('/events/:id', function (req, res) {
    Events.findById(req.params.id, function (err, event) {
        if (err) {
            res.send(err);
        }
        event.title = req.body.title;
        event.type = req.body.type;
        event.start = req.body.start;
        event.end = req.body.end;
        event.can_subscribe = req.body.can_subscribe;
        event.number_limit = req.body.number_limit;
        event.location = {
            lat: req.body.lat,
            long: req.body.long,
            name: req.body.location_name
        };
        event.description = req.body.description;
        event.save(function (err) {
            if (err) {
                res.send(err);
            }
            res.json(event);
        });
    });
})
router.delete('/events/:id', function (req, res) {

    Events.remove({ _id: req.params.id }, function (err, event) {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Successfully deleted' });
    });

});

module.exports = router;