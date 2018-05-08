

const express = require('express');
const bodyParser = require('body-parser');
const { JobPost } = require('./models/jobpost');
const { AdminLogin } = require('./models/adminlogin');
const { Application } = require('./models/application')
const { Resume } = require('./models/resume');
const multer = require('multer');
const validator = require('validator');
const _ = require('lodash');
var { authenticate } = require('../middleware/authenticate');
var csv = require("fast-csv");
var fs = require('file-system');

var jsonParser = bodyParser.json();

var app = express();
var baseurl = '/home/experion/Documents/node_works/job-portal-backend';
var __dirname = '/home/experion/Documents/node_works/job-portal-backend';
//app.use(bodyParser.json());

//app.use(express.static(__dirname, 'public'));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    //res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept,auth');
    res.header('Access-Control-Expose-Headers', 'auth');
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


const ValidateResumeUpload = (req) => {

    if (!req.file) {

        throw new Error('Missing File...');
    }

    var _validFileExtensions = [".pdf", ".doc", ".docx"];

    let resumefile = req.file.filename;

    if (resumefile.length > 0) {
        var fileValid = false;
        for (var j = 0; j < _validFileExtensions.length; j++) {
            var extension = _validFileExtensions[j];
            if (resumefile.substr(resumefile.length - extension.length, extension.length).toLowerCase() == extension.toLowerCase()) {
                fileValid = true;
                break;
            }
        }

        if (!fileValid) {
            throw new Error('Invalid file type...');
        }

    }

}

const ValidatePostBulkUpload = (req) => {

    if (!req.file) {

        throw new Error('Missing File...');
    }

    var _validFileExtensions = [".csv"];

    let jobfile = req.file.filename;

    if (jobfile.length > 0) {
        var fileValid = false;
        for (var j = 0; j < _validFileExtensions.length; j++) {
            var extension = _validFileExtensions[j];
            if (jobfile.substr(jobfile.length - extension.length, extension.length).toLowerCase() == extension.toLowerCase()) {
                fileValid = true;
                break;
            }
        }

        if (!fileValid) {
            throw new Error('Invalid file type...');
        }

    }

}


app.post('/jobportal/posts', jsonParser, authenticate, (req, res) => {
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

// app.post('/jobportal/login', jsonParser, (req, res) => {

//     var id = '';

//     try {
//         const isValid = ValidateLogin(req);

//         AdminLogin.findOne({
//             $and: [{
//                 email: req.body.email
//             },
//             {
//                 password: req.body.password
//             }
//             ]
//         }).then((data) => {
//             // console.log(data);
//             res.send(data.email);
//         }, (e) => {

//             res.status(400).send(e);
//         }).catch((e) => {

//             res.status(400).send(e);
//         });
//     }
//     catch (e) {
//         //console.log("inside validator...email3" + e);
//         res.status(400).send(String(e));
//     }

// });

//admin creation and header setting

app.post('/jobportal/user', jsonParser, (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new AdminLogin(body);
    user.save().then(() => {
        return user.generateAuthToken();

    }).then((token) => {
        res.header('auth', token).send(user);
    }).catch((e) => {
        console.log(e);
        res.status(400).send(e);
    });

});

//admin login

app.post('/jobportal/adminlogin', jsonParser, (req, res) => {
    // console.log("...in....");
    try {
        const isValid = ValidateLogin(req);
        var body = _.pick(req.body, ['email', 'password']);
        AdminLogin.findByCredentials(body.email, body.password).then((user) => {
            return user.generateAuthToken().then((token) => {
                res.header('auth', token).send(user);
            }, (err) => {
                console.log(e);
            });
        }).catch((e) => {
            // console.log(e);
            res.status(400).send(String(e));
        });



    } catch (e) {
        res.status(400).send(String(e));
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
        // cb(null, '/home/experion/Documents/uplodedfiles');
        cb(null, baseurl + '/uploads');

    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage });


app.post('/jobportal/fileUpload', upload.single('file'), (req, res, next) => {

    var host = 'localhost:3000';
    const filepath = req.protocol + "://" + host + req.file.path;
    //console.log(req.file.filename);
    try {
        const isValid = ValidateResumeUpload(req);

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

    } catch (e) {
        res.status(400).send(String(e));
    }

});



app.post('/jobportal/fileUploadPost', upload.single('file'), authenticate, (req, res, next) => {
    try {
        const isValid = ValidatePostBulkUpload(req);

        console.log(req.file);
      
        var posts = [];
        var isDataValid = true;
        //console.log('inside file upload posts....' + req.file.path);
        var stream = fs.createReadStream(req.file.path);

        csv
            .fromStream(stream, { headers: true })
            .on("data", function (data) {
                // console.log(data);



                var date = new Date();
                var jobpost = new JobPost({
                    title: data.Title,
                    postedon: date,
                    postedby: data.PostedFor,
                    location: data.Location,
                    description: data.Description,
                    requirements: data.Requirements,
                    company: data.Organization
                });
                posts.push(jobpost);

                // jobpost.save().then((post) => {
                //     console.log(post);
                // }, (e) => {
                //     console.log(e);
                //     isDataValid = false;
                //     res.status(400).send();

                // }).catch((e) => {
                //     res.status(400).send();
                // });


            })
            .on("end", function () {
                console.log("done");

                JobPost.bulkInsert(posts, function (err, results) {
                    if (err) {
                        console.log(err);
                        res.status(400).send();
                        
                    } else {
                        //console.log(results);
                        res.status(200).send();
                        
                    }
                });
                // if (isDataValid) {
                //     res.status(200).send();
                // }
                // else {
                //     res.status(400).send();
                // }

            });

        //res.status(200).send();

    } catch (e) {
        res.status(400).send(String(e));
    }




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

app.get('/jobportal/adminHome', authenticate, (req, res) => {
    JobPost.find({ is_deleted: false }).then((posts) => {

        res.send(posts);
    }, (e) => {
        res.status(404).send(e);
    }).catch((e) => {
        res.status(400).send();
    });
});


// var perpage = 10;
// var page;

// app.get('/jobportal', (req, res) => {

//     page = req.query.page || 1;
//     console.log(page);
//     JobPost.find().
//         skip((perpage * page) - perpage)
//         .limit(perpage)
//         .then((posts) => {
//             res.send(posts);
//         }, (e) => {
//             res.status(404).send(e);
//         });
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

app.put('/jobportal/updatepost', jsonParser, authenticate, (req, res) => {

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

app.patch('/jobportal/deletepost', jsonParser, authenticate, (req, res) => {
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

app.delete('/jobportal/logout', authenticate, (req, res) => {

    // console.log("inside delete..." + req.admin);
    //var admin=new AdminLogin(req.admin);
    req.admin.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });


});



app.listen(3000, () => {
    console.log('server up on port 3000...');
});



module.exports = { app };


