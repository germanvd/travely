var express                 = require('express');
var expressSanitizer        = require('express-sanitizer');
var methodOverride          = require('method-override');
var app                     = express();
var mongoose                = require('mongoose');
var passport                = require ("passport");
var bodyParser              = require('body-parser');
var LocalStrategy           = require ("passport-local");
var passportLocalMongoose   = require ("passport-local-mongoose");
var session                 = require('express-session');
mongoose.Promise            = require('bluebird');

var seedDB = require ("./seeds");
var Comment = require ("./models/comment");
var Blog = require ("./models/blog");
var User = require ("./models/user");

var commentRoutes = require ("./routes/comments");
var blogRoutes = require ("./routes/blogs");
var indexRoutes = require ("./routes/index");

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
mongoose.connect('mongodb://localhost/blogApp');
app.set("view engine", "ejs");
app.use (express.static(__dirname + "/public"));

app.use(session({
  secret: 'To bo kul travelApp!',
  resave: false,
  saveUninitialized: false
}));

app.use (passport.initialize());
app.use (passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.use (indexRoutes);
app.use (blogRoutes);
app.use (commentRoutes);

app.listen (process.env.PORT, process.env.IP, function() {
   console.log ("BlogApp has started!");
});