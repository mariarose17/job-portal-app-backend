
// const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');

const { JobPost } = require('./jobpost');
const { Resume } = require('./resume');

var ApplicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
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
    }
});

var Application = mongoose.model('Application', ApplicationSchema);

module.exports = { Application };