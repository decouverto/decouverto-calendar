var express = require('express');
var router = express.Router();

var connections = require('../lib/connections.js');
var Events = connections.Events;
var Emails = connections.Emails;

var emailService = require('../lib/emails.js');
var weekdays = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

function getHours(date) {
    return date.getHours() + 'h' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
}


function getDay(date) {
    return (date.getDate() < 10 ? '0' : '') + date.getDate() + '/' + (date.getMonth() < 10 ? '0' : '') + (date.getMonth() + 1);
}

/* GET unsubscribe page */
router.get('/:email', function (req, res) {
    Emails.find({ email: req.params.email }).populate('event', { title: 1, start: 1, type: 1}).exec(function (err, email) {
        if (err) return next(err);
        res.locals.email = email;
        for (var i=0; i<res.locals.email.length; i++) {
            console.log(res.locals.email[i].event);
                var start = new Date(res.locals.email[i].event.start);
                var text = 'Le ' + weekdays[start.getDay()] + ' ' +  getDay(start);
        
                if (res.locals.email[i].event.is_defined_end) {
                    text += ' de ' + getHours(start) + ' à ';
                    var end = new Date(res.locals.email[i].event.end);
                    text += getHours(end);
                } else {
                    text += ' à ' + getHours(start);
                }
                res.locals.email[i].event.formatedDate = text
        }
        res.locals.error = req.flash('error');
        res.locals.success = req.flash('success');
        res.render('email-page');
    });
});

var errorUnsubscribe = function (req, res) {
    req.flash('error', 'Une erreur a été rencontrée.');
    res.redirect('/email/' + req.params.email);
};

var arrayRemove = function (arr, value) {
    return arr.filter(function(ele){
        return ele != value;
    });
};

router.get('/:email/:id', function (req, res) {
    /* Check if email still exists */
    Emails.findById(req.params.id, function (err, email) {
        if (err) return errorUnsubscribe(req, res);
        
        /* Look for event */
        Events.findById(email.event, function (err, event) {
            if (err) return errorUnsubscribe(req, res);
            /* Unlike event */
            event.emails = arrayRemove(event.emails, req.params.id);
            event.save(function (err) {
                if (err) return errorUnsubscribe(req, res);

                /* Remove email */
                Emails.deleteOne({ _id: req.params.id }, function (err) {
                    if (err) return errorUnsubscribe(req, res);
                    req.flash('success', 'Vous avez été désinscrits de l\'événement "' + event.title + '".');
                    res.redirect('/email/' + req.params.email);
                    emailService.unsubscribe(email, event);
                });
            });
        });

    });
});

module.exports = router;
