
var express = require('express');
var router = express.Router();
var auth = require('../policies/auth.js');
var eventSchema = require('../schemas/event.js');
var emailSchema = require('../schemas/email.js');


var mongoose = require('mongoose');
var connection = mongoose.createConnection('mongodb://localhost:27017/decouverto-calendar', { useNewUrlParser: true });

var Events = connection.model('Events', eventSchema);
var Emails = connection.model('Emails', emailSchema);

router.get('/events/', auth, function (req, res, next) {
    Events.find(function (err, events) {
        if (err) return next(err);
        res.json(events);
    });
});

router.get('/events/types', auth, function (req, res, next) {
    Events.distinct('type', function (err, events) {
        if (err) return next(err);
        res.json(events);
    });
})


router.post('/events/', auth, function (req, res, next) {
    var event = new Events();

    event.title = req.body.title;
    event.type = req.body.type;
    event.start = req.body.start;
    event.description = req.body.description;


    event.can_subscribe = req.body.can_subscribe;
    if (req.body.can_subscribe) {
        event.number_limit = req.body.number_limit;
    }
    event.is_defined_end = req.body.is_defined_end;
    if (req.body.is_defined_end) {
        event.end = req.body.end;
    }

    event.is_located = req.body.is_located;
    if (req.body.is_located) {
        event.location = {
            lat: req.body.lat,
            long: req.body.long,
            name: req.body.location_name
        };
    }

    event.walk_id = req.body.walk_id;

    event.save(function (err) {
        if (err) return next(err);
        res.json(event);
    });
});

router.get('/events/:id', auth, function (req, res, next) {
    Events.findById(req.params.id, function (err, event) {
        if (err) next(err);
        res.json(event);
    });
});
router.get('/events/:id/emails', auth, function (req, res, next) {
    Events.findById(req.params.id).populate('emails', { _id: 0, name: 1, email: 1, firstname: 1}).exec(function (err, event) {
        if (err) next(err);
        res.json(event);
    });
});

router.put('/events/:id', auth, function (req, res, next) {
    Events.findById(req.params.id, function (err, event) {
        if (err) return next(err);
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
            if (err) return next(err);
            res.json(event);
        });
    });
})

router.delete('/events/:id', auth, function (req, res, next) {
    /* Supprimer les mails associés */
    Events.remove({ _id: req.params.id }, function (err, event) {
        if (err) return next(err);
        res.json({ message: 'Successfully deleted' });
    });

});


router.get('/emails/', auth, function (req, res, next) {
    Emails.find(function (err, events) {
        if (err) {
            next(err);
        }
        res.json(events);
    });
});


router.post('/emails/', function (req, res, next) {
    var email = new Emails();

    email.name = req.body.name;
    email.email = req.body.email;
    email.firstname = req.body.firstname;
    email.event = req.body.event;


    Events.findById(req.body.event, function (err, event) { // Vérifier ici que le couple event - email soit unique
        if (err) return next(err);
        event.emails.push(email);

        event.save(function (err) {
            if (err) return next(err);
            email.save(function (err) {
                if (err) return next(err);
                res.json(email);
            });
        });
    });
    
});

router.get('/emails/:email', auth, function (req, res, next) {
    Emails.find({ email: req.params.email }).populate('event', { _id: 1, title: 1}).exec(function (err, email) {
        if (err) return next(err);
        res.json(email);
    });
})

router.delete('/emails/:id', auth, function (req, res, next) {
    /* Supprimer le lien dans l'événement */
    Emails.remove({ _id: req.params.id }, function (err) {
        if (err) return next(err);
        res.json({ message: 'Successfully deleted' });
    });

});

module.exports = router;