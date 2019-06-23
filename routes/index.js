var express = require('express');
var passport = require('passport');
var router = express.Router();
var auth = require('../policies/auth.js');

var connections = require('../lib/connections.js');
var Events = connections.Events;
var Emails = connections.Emails;


function getHours(date) {
    var h = date.getHours(),
        m = date.getMinutes();
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
}

function getDay(date) {
    var h = date.getDate(),
        m = date.getMonth();
    return (h < 10 ? '0' : '') + h + '/' + (m < 10 ? '0' : '') + m;
} 

var weekdays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

/* GET home page */
router.get('/', function (req, res) {
    Events.find({ start: { $gte: new Date() }}).sort({start: 'asc'}).exec(function (err, events) {
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

/* GET admin page */
router.get('/admin', auth, function (req, res) {
    res.render('admin');
});

/* GET login page */
router.get('/admin/login', function (req, res) {
    res.locals.message = req.flash('error');
    res.render('login');
});

/* POST login */
router.post('/admin/login', passport.authenticate('local', {
    failureRedirect: '/admin/login',
    failureFlash: true,
    passReqToCallBack: true
}), function (req, res) {
    res.redirect('/admin');
});

/* GET logout */
router.get('/admin/logout', function (req, res) {
    req.logout();
    res.redirect('/admin');
});

module.exports = router;
