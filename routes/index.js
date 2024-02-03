var express = require('express');
var router = express.Router();
var ics = require('ics');
var connections = require('../lib/connections.js');
var Events = connections.Events;


function getHours(date) {
    var h = date.getHours(),
        m = date.getMinutes();
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
}

function getDay(date) {
    var h = date.getDate(),
        m = date.getMonth()+1,
        y = date.getFullYear();
    return (h < 10 ? '0' : '') + h + '/' + (m < 10 ? '0' : '') + m + '/' + y;
} 

var weekdays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

/* GET home page */
router.get('/', function (req, res) {
    var searchDate = new Date();
    searchDate.setHours(searchDate.getHours()-1);
    Events.find({ start: { $gte: searchDate }}).sort({start: 'asc'}).exec(function (err, events) {
        if (err) {
            res.locals.events = [];
        } else {
            for(var i=0; i<events.length; i++) {
                var start = new Date(events[i].start);
                var text = 'Le ' + weekdays[start.getDay()] + ' ' +  getDay(start);
        
                if (events[i].is_defined_end) {
                    text += ' de ' + getHours(start) + ' à ';
                    var end = new Date(events[i].end);
                    text += getHours(end);
                } else {
                    text += ' à ' + getHours(start);
                }
                events[i].formatedDate = text
            }
            res.locals.events = events;
        }
        res.render('index');
    });
    
});

router.get('/evenement/:id', function (req, res, next) {
    var searchDate = new Date();
    searchDate.setHours(searchDate.getHours()-1);
    Events.find({ start: { $gte: searchDate }}).sort({start: 'asc'}).exec(function (err, events) {
        if (err) return next(err);
        if (events.length==0) {
            res.status(404);
            return res.redirect('/');
        }
        for(var i=0; i<events.length; i++) {
            if (events[i]._id == req.params.id) {
                var start = new Date(events[i].start);
                var text = 'Le ' + weekdays[start.getDay()] + ' ' +  getDay(start);
            
                if (events[i].is_defined_end) {
                    text += ' de ' + getHours(start) + ' à ';
                    var end = new Date(events[i].end);
                    text += getHours(end);
                } else {
                    text += ' à ' + getHours(start);
                }
                events[i].formatedDate = text
                res.locals.event = events[i];
                return res.render('event');
            }
        }
        res.status(404);
        return res.redirect('/');
    });
});


/**
 * Create ICS file for calendar apps
 */
function dateForICS(rawDate) {
    var date = new Date(rawDate);
    return [date.getFullYear(), date.getMonth()+1, date.getDate(), date.getHours(), date.getMinutes()]
}
router.get('/ics-file/:id', function(req, res, next) {
    Events.findById(req.params.id, function(err, event) {
        if (err) next(err);

        var obj = {
            start: dateForICS(event.start),
            title: event.title,
            description: 'Vous avez été inscrits de l\'événement "' + event.title + '". Plus d’information sur https://calendrier.decouverto.fr/#/' + event.id,
            url: 'https://calendrier.decouverto.fr/#/' + event.id,
            status: 'CONFIRMED'
        }

        if (event.is_located) {
            obj.location = event.location.name + ' (lat: ' + event.location.lat + ', long: ' + event.location.long + ')';
            obj.description = obj.description + ' Localisation: ' + obj.location;
            obj.geo = { lat: event.location.lat, lon: event.location.long };
        } 

        if (event.is_defined_end) {
            obj.end = dateForICS(event.end);
        } else {
            replacementEnd = new Date(event.start);
            replacementEnd.setHours(23);
            replacementEnd.setMinutes(59);
            obj.end = dateForICS(replacementEnd);
        }

        ics.createEvent(obj, (error, value) => {
            if (error) return next(error);
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Content-Disposition', `attachment; filename="evenement_decouverto.ics"`);
            res.send(value);
        });
        
    });
});

module.exports = router;
