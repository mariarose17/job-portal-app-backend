

var mongoose = require('mongoose');


var PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1
    },
    postedon: {
        type: Date,
        required: true

    },
    postedby: {
        type: String,
        required: true,
        minlength: 1

    },
    company: {
        type: String,
        required: true,
        minlength: 1
    },
    location: {
        type: String,
        required: true,
        minlength: 1
    },
    description: {
        type: String,
        required: true,
        minlength: 1
    },
    requirements: {
        type: String,
        required: true,
        minlength: 1
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    is_Active: {
        type: Boolean,
        default: true

    }


});

var JobPost = mongoose.model('JobPost', PostSchema);

module.exports = { JobPost };
