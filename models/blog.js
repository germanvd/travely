var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   comments: [
       {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        }
    ]
});

module.exports = mongoose.model ("Blog", blogSchema);