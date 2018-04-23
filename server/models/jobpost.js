

var mongoose = require('mongoose');


var PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    postedon: {
        type: Date,
        required: true

    },
    postedby: {
        type: String,
        required: true

    },
    company: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: {
        type: String,
        required: true
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
