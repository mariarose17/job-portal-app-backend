var { AdminLogin } = require('../server/models/adminlogin');

var authenticate = (req, res, next) => {
    //console.log("inside authenticate");
    var token = req.header('auth');
    AdminLogin.findByToken(token).then((admin) => {
        if (!admin) {
            return Promise.reject();
        }

        req.admin = admin;
        req.token = token;
       // console.log("admin:.." + req.admin + ".....token...." + req.token);
        next();
    }).catch((err) => {
        res.status(401).send();
    });
}

module.exports = { authenticate };