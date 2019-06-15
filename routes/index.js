var express = require('express');
var passport = require('passport');
var router = express.Router();
var auth = require('../policies/auth.js');

/* GET home page */
router.get('/', function (req, res) {
    res.render('index');
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
