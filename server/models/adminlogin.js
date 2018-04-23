
var mongoose = require('mongoose');
var validator=require('validator');

var LoginSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true
    }

});

var AdminLogin = mongoose.model('LoginCredentials', LoginSchema);

module.exports = { AdminLogin };

