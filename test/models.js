var mongoose = require("mongoose");

var model = {};

module.exports = model;

model.Post = mongoose.model('Post', new mongoose.Schema({
    title: String
}));

model.Person = mongoose.model('Person', new mongoose.Schema({
    name: String,
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
}));
