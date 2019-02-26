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
            req.flash ("error", err.message);
            res.redirect ("/register");
        } else {
            passport.authenticate ("local")(req, res, function() {
                req.flash ("success", "Bienvenidos a este blogs :)");
                res.redirect("/blogs");
            });
        }
    });
});

//GET LOGIN FORM
router.get ("/login", function (req, res) {
    res.render ("login");
});

//HANDLING LOGIN
router.post ("/login", passport.authenticate ("local", {
    successRedirect: "/blogs",
    successFlash: "Bienvenidos",
    failureRedirect: "/login",
    failureFlash: true
}), function (req, res) {
});

//LOGOUT
router.get ("/logout", function(req, res) {
    req.flash("success", "Has salido de tu Login!");
    req.logout();
    res.redirect("/blogs");
});

module.exports = router;