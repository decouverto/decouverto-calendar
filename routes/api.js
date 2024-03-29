var express = require('express');
var router = express.Router();
var auth = require('../policies/auth.js');
var each = require('async-each');
var path = require('path');
var fs = require('fs');

var connections = require('../lib/connections.js');
var Events = connections.Events;
var Emails = connections.Emails;

var emailService = require('../lib/emails.js');

function generateRandomString(length) {
    var characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var randomString = '';
  
    for (let i = 0; i < length; i++) {
      var randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
  
    return randomString;
}

function removeImage(filename, cb) {
    if (filename == '' || typeof filename === 'undefined') {
        return cb(null);
    }
    var filePath = path.resolve(__dirname, '../public/images/', filename);
    fs.access(filePath, fs.constants.F_OK, function (err) {
        if (!err) {
            fs.unlink(filePath, function (err) {
                if (err) return cb(err);
                cb(null);
            });
        } else {
            cb(null);
        }
    });
}

var multer = require('multer');
var upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.resolve(__dirname, '../public/images/'));
        },
        filename: function (req, file, cb) {
            cb(null, generateRandomString(7) + '.png');
        }
    })
});

router.get('/events/', auth, function(req, res, next) {
    Events.find(function(err, events) {
        if (err) return next(err);
        res.json(events);
    });
});

router.get('/events/types', auth, function(req, res, next) {
    Events.distinct('type', function(err, events) {
        if (err) return next(err);
        res.json(events);
    });
})


router.post('/events/', auth, upload.single('file'), function(req, res, next) {
    var event = new Events();
    if (req.file === undefined) {
        event.filename = '';
    } else {
        event.filename = req.file.filename;
    }
    

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

    event.save(function(err) {
        if (err) return next(err);
        res.json(event);
    });
});

router.get('/events/:id', auth, function(req, res, next) {
    Events.findById(req.params.id, function(err, event) {
        if (err) next(err);
        res.json(event);
    });
});
router.get('/events/:id/emails', auth, function(req, res, next) {
    Events.findById(req.params.id).populate('emails', { name: 1, email: 1, firstname: 1 }).exec(function(err, event) {
        if (err) next(err);
        res.json(event);
    });
});

router.put('/events/:id/image', auth, upload.single('file'), function(req, res, next) {
    if (req.file === undefined) {
        err = new Error('You must upload a file.');
        err.status = 400;
        return next(err);
    }
    Events.findById(req.params.id, function(err, event) {
        if (err) return next(err);

        removeImage(event.filename, function(err) {
            if (err) return next(err);
            event.filename = req.file.filename;

            event.save(function(err) {
                if (err) return next(err);
                res.json(event);
            });
        });

    });
});

router.delete('/events/:id/image', auth, function(req, res, next) {
    Events.findById(req.params.id, function(err, event) {
        if (err) return next(err);
        
        removeImage(event.filename, function(err) {
            if (err) return next(err);
            event.filename = '';

            event.save(function(err) {
                if (err) return next(err);
                res.json(event);
            });
        });
        
    });
});

router.put('/events/:id', auth, function(req, res, next) {
    Events.findById(req.params.id, function(err, event) {
        if (err) return next(err);
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

        event.save(function(err) {
            if (err) return next(err);
            res.json(event);
        });
    });
})

router.delete('/events/:id', auth, function(req, res, next) {
    Events.findById(req.params.id, function(err, event) {
        if (err) next(err);
        each(event.emails, function(email, callback) {
            Emails.deleteOne({ _id: email }, callback);
        }, function(err) {
            if (err) next(err);
            removeImage(event.filename, function(err) {
                if (err) return next(err);
                Events.deleteOne({ _id: req.params.id }, function(err, event) {
                    if (err) return next(err);
                    res.json({ message: 'Successfully deleted' });
                });
            });
        });
    });
});


router.get('/emails/', auth, function(req, res, next) {
    Emails.find(function(err, events) {
        if (err) {
            next(err);
        }
        res.json(events);
    });
});



router.post('/emails/', function(req, res, next) {
    var email = new Emails();

    email.name = req.body.name;
    email.email = req.body.email;
    email.firstname = req.body.firstname;
    email.event = req.body.event;

    Events.findById(req.body.event).populate('emails', { _id: 0, email: 1 }).exec(function(err, event) { // Vérifier ici que le couple event - email soit unique
        if (err) return next(err);
        if (Array.from(event.emails, x => x.email).includes(email.email) || event.emails.length == event.number_limit) {
            err = new Error('Cannot subscribe');
            err.status = 403;
            next(err);
        } else {
            event.emails.push(email);

            event.save(function(err) {
                if (err) return next(err);
                email.save(function(err) {
                    if (err) return next(err);
                    res.json(email);
                    emailService.subscribe(email, event)
                });
            });
        }

    });

});

router.post('/emails/custom', auth, function(req, res, next) {
    emailService.sendCustomMail(req.body, function(err) {
        if (err) return next(err);
        res.json({ sent: true })
    })
});

router.get('/emails/:email', auth, function(req, res, next) {
    Emails.find({ email: req.params.email }).populate('event', { _id: 1, title: 1 }).exec(function(err, email) {
        if (err) return next(err);
        res.json(email);
    });
});

var arrayRemove = function(arr, value) {
    return arr.filter(function(ele) {
        return ele != value;
    });
};

router.delete('/emails/:id', auth, function(req, res, next) {
    /* Check if email still exists */
    Emails.findById(req.params.id, function(err, email) {
        if (err) return next(err);

        /* Look for event */
        Events.findById(email.event, function(err, event) {
            if (err) return next(err);
            /* Unlike event */
            event.emails = arrayRemove(event.emails, req.params.id);
            event.save(function(err) {
                if (err) return next(err);

                /* Remove email */
                Emails.deleteOne({ _id: req.params.id }, function(err) {
                    if (err) return next(err);
                    res.json({ message: 'Successfully deleted' });
                });
            });
        });
    });
});

module.exports = router;