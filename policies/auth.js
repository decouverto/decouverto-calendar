// test if user is authenticated
module.exports = function (req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/admin/login');
    } else {
        next();
    }
};