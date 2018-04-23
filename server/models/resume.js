var mongoose = require('mongoose');
var validator = require('validator');

var ResumeSchema = new mongoose.Schema({
    path: {
        type: String,
        required: true,
        trim: true
    }
});


var Resume = mongoose.model('Resume', ResumeSchema);
module.exports = { Resume };
