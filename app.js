var express          = require('express');
var expressSanitizer = require('express-sanitizer');
var methodOverride   = require('method-override');
var app              = express();
var mongoose         = require('mongoose');
var bodyParser       = require('body-parser');
mongoose.Promise     = require('bluebird');

var seedDB = require ("./seeds");
var Comment = require ("./models/comment");
var Blog = require ("./models/blog");

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
mongoose.connect('mongodb://localhost/travelBlogApp');
app.set("view engine", "ejs");
app.use (express.static(__dirname + "/public"));

seedDB();

//ROOT ROUTE
app.get ("/", function (req, res) {
   res.redirect ("/blogs");
});

//INDEX ROUTE
app.get ("/blogs", function (req, res) {
   Blog.find({}, function (err, blogs) {
      if (err) {
         console.log(err);
      } else {
         res.render ("index", {blogs: blogs});
      }
   });
});

//NEW ROUTE
app.get ("/blogs/new", function (req, res) {
   res.render ("new");
});

//CREATE ROUTE
app.post ("/blogs", function (req, res) {
   req.body.blog.description = req.sanitize(req.body.blog.description);
   Blog.create (req.body.blog, function (err) {
      if (err) {
         console.log (err); 
      } else {
         res.redirect ("/blogs");
      }
   });
});

//SHOW ROUTE
app.get ("/blogs/:id", function (req, res) {
   var id = req.params.id;
   Blog.findById (id, function (err, foundBlog) {
      if(err) {
         console.log(err);
      } else {
         res.render ("show", {foundBlog: foundBlog});
      }
   });
});

//EDIT ROUTE
app.get ("/blogs/:id/edit", function (req, res) {
   var id = req.params.id;
   Blog.findById(id, function (err, foundBlog) {
      if(err) {
         console.log(err);
      } else {
         res.render ("edit", {foundBlog: foundBlog});
      }
   });
});

//UPDATE ROUTE
app.put ("/blogs/:id", function (req, res) {
   req.body.description = req.sanitize(req.body.description);
   var id = req.params.id;
   var name = req.body.name;
   var image = req.body.image;
   var description = req.body.description;
   var updatedBlog = {name: name, image: image, description: description};
   Blog.findByIdAndUpdate (id, updatedBlog, function (err) {
      if(err) {
         console.log(err); 
      } else {
         res.redirect ("/blogs/" + id);
      }
   });
});

//DELETE ROUTE
app.delete ("/blogs/:id", function(req, res) {
   var id = req.params.id;
   Blog.findByIdAndRemove (id, function (err) {
      if(err) {
         console.log(err);
      } else {
         res.redirect ("/blogs/");
      }
   });
});

//ALL OTHER PATHS - REDIRECT
app.get ("*", function(req, res) {
    res.redirect ("/blogs");
});

app.listen (process.env.PORT, process.env.IP, function() {
   console.log ("REST_app_ponovitev has started");
});