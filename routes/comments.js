var express = require('express');
var router = express.Router();
var Blog = require ("../models/blog");
var Comment = require ("../models/comment");


//NEW COMMENT
router.get ("/blogs/:id/comments/new", isLoggedIn, function (req, res) {
    Blog.findById (req.params.id, function (err, foundBlog) {
        if(err) {
            console.log (err);
        } else {
           res.render ("comment/new", {foundBlog: foundBlog}); 
        }
    });
});

//CREATE COMMENT
router.post ("/blogs/:id/comments", function (req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            console.log(err);
        } else {
            Comment.create (req.body, function(err, newComment) {
                if(err) {
                    console.log(err);
                } else {
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    foundBlog.comments.push(newComment);
                    foundBlog.save();
                    res.redirect ("/blogs/" + req.params.id);
                }
            });
        }
    });
});

//EDIT COMMENT ROUTE
router.get ("/blogs/:id/comments/:commentId/edit", function (req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            console.log(err);
        } else {
            Comment.findById(req.params.commentId, function(err, foundComment) {
                if(err) {
                    console.log(err);
                } else {
                    res.render ("comment/edit", {foundBlog: foundBlog, foundComment: foundComment});
                }
            });
        }
    });
});

//UPDATE COMMENT
router.put ("/blogs/:id/comments/:commentId", function (req, res) {
    Comment.findByIdAndUpdate (req.params.commentId, req.body, function (err) {
        if(err) {
            console.log(err); 
        } else {
            res.redirect ("/blogs/" + req.params.id);
        }
    });
});

//DELETE ROUTE
router.delete ("/blogs/:id/comments/:commentId", function(req, res) {
    Comment.findByIdAndRemove (req.params.commentId, function (err) {
        if(err) {
         console.log(err);
        } else {
            Blog.findById(req.params.id, function (err, foundBlog) {
                if (err) {
                    console.log(err);
                } else {
                    foundBlog.comments.remove(req.params.commentId); 
                    foundBlog.save();
                    res.redirect ("/blogs/" + req.params.id);
                }
            });
        }
    });
});

//middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect ("/login");
}

module.exports = router;