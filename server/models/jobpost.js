

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

PostSchema.statics.bulkInsert = function (posts, fn) {
    if (!posts || !posts.length)
        return fn(null);

    var bulk = this.collection.initializeOrderedBulkOp();
    if (!bulk)
        return fn('bulkInsertModels: MongoDb connection is not yet established');

    var post;
    for (var i = 0; i < posts.length; i++) {
        post = posts[i];
        bulk.insert(post);
    }
  
    bulk.execute(fn);
};




var JobPost = mongoose.model('JobPost', PostSchema);

module.exports = { JobPost };
