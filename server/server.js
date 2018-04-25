

const express = require('express');
const bodyParser = require('body-parser');
const { JobPost } = require('./models/jobpost');
const { AdminLogin } = require('./models/adminlogin');
const { Application } = require('./models/application')
const { Resume } = require('./models/resume');
const multer = require('multer');
const validator = require('validator');
var jsonParser = bodyParser.json();

var app = express();
//app.use(bodyParser.json());


app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
var { mongoose } = require('./db/mongoose');


const ValidateLogin = (req) => {

    if (!req.body) {

        throw new Error('Missing required data...');
    }
    if (!validator.isEmail(req.body.email)) {

        throw new Error('Invalid Email...');
    }

}

app.post('/jobportal/posts', jsonParser, (req, res) => {
    // console.log(req.body);


    var date = new Date();
    var jobpost = new JobPost({
        title: req.body.title,
        postedon: date,
        postedby: req.body.postedby,
        location: req.body.location,
        description: req.body.description,
        requirements: req.body.requirements,
        company: req.body.company
    });

    jobpost.save().then((post) => {
        res.send(post);
    }, (e) => {
        res.status(400).send(e);
    });

});

app.post('/jobportal/login', jsonParser, (req, res) => {
    //console.log(req.body);


    var id = '';

    // var adminlogin = new AdminLogin({
    //     email: req.body.email,
    //     password: req.body.password
    // });

    // adminlogin.save().then((admin) => {
    //     res.send(admin);
    // }, (e) => {
    //     res.status(400).send(e);
    // });

    // if (req.body.email === 'admin@gmail.com' && req.body.password === 'admin123') {
    //     // var id = '5acf1edf63b52b1f448c0a33';

    //     res.status(200).send();

    // }

    // else {
    //     res.status(400).send();
    // }

    try {
        const isValid = ValidateLogin(req);

        AdminLogin.findOne({
            $and: [{
                email: req.body.email
            },
            {
                password: req.body.password
            }
            ]
        }).then((data) => {
            // console.log(data);
            res.send(data.email);
        }, (e) => {

            res.status(400).send(e);
        }).catch((e) => {

            res.status(400).send(e);
        });
    }
    catch (e) {
        //console.log("inside validator...email3" + e);
        res.status(400).send( String(e));
    }



});

app.post('/jobportal/application', jsonParser, (req, res) => {
    //console.log(req.body);

    var application = new Application({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        exp: req.body.exp,
        skills: req.body.skills,
        _postId: req.body._postId,
        _resumeId: req.body._resumeId
    });

    application.save().then((data) => {
        res.send(data);
    }, (e) => {
        res.status(400).send(e);
    }).catch((e) => {
        res.status(400).send();
    });
});


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/home/experion/Documents/images/');

    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage });


app.post('/jobportal/fileUpload', upload.single('file'), (req, res, next) => {

    //console.log(req.file);
    //console.log('inside file upload....' + req.file);
    //console.log('inside file upload....' + req.file.path);

    // var filepath = String(req.file.path);

    var resume = new Resume({
        path: req.file.path
    });

    resume.save().then((file) => {
        res.send(file);
    }, (e) => {
        res.status(400).send(e);
    }).catch((e) => {
        res.status(400).send();
    });

});

app.get('/jobportal', (req, res) => {
    JobPost.find({ is_deleted: false }).then((posts) => {

        res.send(posts);
    }, (e) => {
        res.status(404).send(e);
    }).catch((e) => {
        res.status(400).send();
    });
});
// var perpage=6;
// var page;

// app.get('/jobportal', (req, res) => {
//     page=req.query.page||1;
//     JobPost.find().
//     skip((perpage*page)-perpage)
//     .limit(perpage)
//     .then((posts) => {
//         res.send(posts);
//     }, (e) => {
//         res.status(404).send(e);
//     });
// });


app.get('/jobportal/applicants/:id', (req, res) => {
    // console.log(req.params);
    var id = req.params.id;
    Application.find({ _postId: id }).then((applications) => {
        //var apcount = applications.length;
        //res.sendStatus(200).send(count);
        //res.status(200).send({ count: apcount });
        res.status(200).send(applications);
    }, (e) => {
        res.status(404).send(e);
    }).catch((e) => {
        res.status(404).send(e);
    });

});

app.put('/jobportal/updatepost', jsonParser, (req, res) => {

    var date = new Date();
    var updatedjobpost = {
        title: req.body.title,
        postedon: date,
        postedby: req.body.postedby,
        location: req.body.location,
        description: req.body.description,
        requirements: req.body.requirements,
        company: req.body.company
    };

    JobPost.findByIdAndUpdate({ _id: req.body._postId }, updatedjobpost, { new: true }).then((post) => {
        res.send(post);
    }, (e) => {
        res.status(400).send(e);
    }).catch((e) => console.log(e));

});

app.patch('/jobportal/deletepost', jsonParser, (req, res) => {
    var updatedjobpost = {
        is_deleted: true,
        is_Active: false
    };

    JobPost.findByIdAndUpdate({ _id: req.body._postId }, updatedjobpost, { new: true }).then((post) => {
        res.send(post);
    }, (e) => {
        res.status(400).send(e);
    }).catch((e) => console.log(e));

});



// app.get('/jobportal/applicants/:id', (req, res) => {
//     console.log(req.params);
//     var id = req.params.id;
//     Application.find({ _postId: id }).then((applications) => {
//         var apcount = applications.length;
//         //res.sendStatus(200).send(count);
//         res.status(200).send({ count: apcount });
//     }, (e) => {
//         res.status(404).send(e);
//     }).catch((e) => {
//         res.status(404).send(e);
//     });

// });


app.listen(3000, () => {
    console.log('server up on port 3000...');
});



module.exports = { app };


