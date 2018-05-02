
const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

var LoginSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 1,
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]

});

LoginSchema.methods.toJSON = function () {
    var admin = this;
    var userObject = admin.toObject();
    return _.pick(userObject, ['_id', 'email']);
};
//auth token generation

LoginSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({ _id: user._id.toHexString(), access }, 'mykey123').toString();
    user.tokens.push({ access, token });
    return user.save().then(() => {
        return token;
    });
};

//admin login
LoginSchema.statics.findByCredentials = function (email, password) {
    var Admin = this;
    return Admin.findOne({ email }).then((user) => {
        if (!user) {
            // console.log("...error");
            return Promise.reject();

        }
        return new Promise((resolve, reject) => {

            //console.log("password" + password + "...user.passwrd" + user.password);
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    // console.log("ifres..." + res);
                    resolve(user);
                } else {
                    //console.log("ifelse" + err);
                    reject();
                }
            });


        });

    });
};


LoginSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });

    } else {
        next();
    }
});

LoginSchema.statics.findByToken = function (token) {

    var Admin = this;
    var decoded;
    try {
        decoded = jwt.verify(token, 'mykey123');
    } catch (e) {
        return Promise.reject();
    }

    return Admin.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};


LoginSchema.methods.removeToken = function (token) {
    var admin = this;
    //console.log("inside removetoken");
    return admin.update({
        $pull: {

            tokens: { token }
        }
    });
};

var AdminLogin = mongoose.model('LoginCredentials', LoginSchema);

module.exports = { AdminLogin };

