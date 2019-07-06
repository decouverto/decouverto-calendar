var express = require('express');
var passport = require('passport');
var router = express.Router();
var auth = require('../policies/auth.js');

/* GET admin page */
router.get('/', auth, function (req, res) {
    res.render('admin');
});

/* GET login page */
router.get('/login', function (req, res) {
    res.locals.message = req.flash('error');
    res.render('login');
});

/* POST login */
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/admin/login',
    failureFlash: true,
    passReqToCallBack: true
}), function (req, res) {
    res.redirect('/admin');
});

/* GET logout */
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/admin');
});


/* GET publish post page */
router.get('/publish-post', auth, function (req, res) {
    res.render('publish-post');
});

module.exports = router;
