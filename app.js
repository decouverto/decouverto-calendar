var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var minifyTemplate = require('express-beautify').minify;

var passport = require('passport');
var hash = require('password-hash-and-salt');
var flash = require('connect-flash');
var helmet = require('helmet');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(compress());

if (app.get('env') === 'development') {
    app.use(logger('dev'));
} else {
    app.use(compress());
    app.use(minifyTemplate());
}

app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());

app.use(flash());
app.use(session({
    secret: 'calendar website of the Découverto organization',
    name: 'decouverto-session',
    proxy: false,
    resave: true,
    saveUninitialized: true,
    store: new MongoDBStore({
        uri: 'mongodb://localhost:27017/decouverto-calendar',
        collection: 'sessions'
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes/index'));
app.use('/api/', require('./routes/api'));

// user collection 
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/decouverto', { useNewUrlParser: true });
var connection = mongoose.connection;

// authentication
passport.serializeUser(function (model, done) {
    done(null, model.email);
});

passport.deserializeUser(function (email, done) {
    connection.db.collection('users', function (err, collection) {
        collection.findOne({ email: email }, function (err, model) {
            if (model != null) {
                delete model.password;
                return done(err, model);
            }
            done(err, false);
        });
    });
});

var LocalStrategy = require('passport-local').Strategy;

// define local strategy
passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallBack: true
}, function (email, password, done) {
    // search in database
    connection.db.collection('users', function (err, collection) {
        collection.findOne({ email: email }, function (err, model) {
            if (err) { return done(err); }
            if (!model) {
                return done(null, false, { message: 'invalid-email' });
            }
            // test password
            hash(password).verifyAgainst(model.password, function (err, verified) {
                if (err || !verified) {
                    return done(null, false, {
                        message: 'invalid-password'
                    });
                } else {
                    var returnmodel = {
                        email: model.email
                    };
                    return done(null, returnmodel, {
                        message: 'Connexion réussi.'
                    });
                }
            });
        });
    });
}));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Élément introuvable');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            status: err.status || 500,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        status: err.status || 500,
        error: {}
    });
});

module.exports = app;