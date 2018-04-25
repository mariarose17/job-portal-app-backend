
// const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');

const { JobPost } = require('./jobpost');
const { Resume } = require('./resume');

var ApplicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1
    },
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        minlength: 1
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    _postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobPost'
    },

    _resumeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume'
    },
    exp: {
        type: String,
        required: true,
        minlength: 1
    },
    skills: {
        type: String,
        required: true,
        minlength: 1
    }
});

var Application = mongoose.model('Application', ApplicationSchema);

module.exports = { Application };