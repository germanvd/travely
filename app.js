var express                 = require('express');
var expressSanitizer        = require('express-sanitizer');
var methodOverride          = require('method-override');
var flash                   = require('connect-flash');
var mongoose                = require('mongoose');
var passport                = require ("passport");
var bodyParser              = require('body-parser');
var LocalStrategy           = require ("passport-local");
var session                 = require('express-session');
mongoose.Promise            = require('bluebird');
var app                     = express();

var User = require ("./models/user");
var commentRoutes = require ("./routes/comments");
var blogRoutes = require ("./routes/blogs");
var indexRoutes = require ("./routes/index");

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
mongoose.connect("mongodb://donsan:12donsan34@ds145230.mlab.com:45230/blog_app");
app.set("view engine", "ejs");
app.use (express.static(__dirname + "/public"));
app.use(flash());

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
    res.locals.success_messages = req.flash('success');
    res.locals.error_messages = req.flash('error');
    next();
});

app.use (indexRoutes);
app.use (blogRoutes);
app.use (commentRoutes);

app.listen (process.env.PORT, process.env.IP, function() {
   console.log ("BlogApp has started!");
});