var express = require('express');
var router = express.Router();
var User = require ("../models/user");
var passport = require ("passport");

//ROOT ROUTE
router.get ("/", function (req, res) {
   res.redirect ("/blogs");
});

//**************
//AUTH ROUTES
//**************

//GET SIGN UP FORM
router.get ("/register", function (req, res) {
    res.render ("register");
});

//HANDLIGN SIGN UP
router.post ("/register", function (req, res) {
    User.register (new User({username: req.body.username}), req.body.password, function (err, user) {
        if(err) {
            console.log (err);
            return res.render ("register");
        } 
        passport.authenticate ("local")(req, res, function() {
        res.redirect("/blogs/new");
        });
    });
});

//GET LOGIN FORM
router.get ("/login", function (req, res) {
    res.render ("login");
});

//HANDLING LOGIN
router.post ("/login", passport.authenticate ("local", {
    successRedirect: "/blogs",
    failureRedirect: "/login"
}), function (req, res) {
});

//LOGOUT
router.get ("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

module.exports = router;