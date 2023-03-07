var express = require('express');
var router = express.Router();

var connections = require('../lib/connections.js');
var Events = connections.Events;


function getHours(date) {
    var h = date.getHours(),
        m = date.getMinutes();
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
}

function getDay(date) {
    var h = date.getDate(),
        m = date.getMonth()+1;
    return (h < 10 ? '0' : '') + h + '/' + (m < 10 ? '0' : '') + m;
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

module.exports = router;
