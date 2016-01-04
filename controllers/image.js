
var fs = require('fs'),
    path = require('path'),
    sidebar = require('../helpers/sidebar'),
    Models = require('../models');
module.exports = {
    index: function(req, res) {
        var viewModel = {
            image: {},
            comments: []
        };
        Models.Image.findOne({ filename: { $regex: req.params.image_id } },
            function(err, image) {
                if (err) { throw err; }
                if (image) {
                    image.views = image.views + 1;
                    viewModel.image = image;
                    image.save();
                    Models.Comment.find({ image_id: image._id}, {}, { sort: { 'timestamp': 1 }},
                        function(err, comments){
                            if (err) { throw err; }
                            viewModel.comments = comments;
                            sidebar(viewModel, function(viewModel) {
                                res.render('image', viewModel);
                            });
                        }
                    );
                } else {
                    res.redirect('/');
                }
            });
    },
    create: function(req, res) {
        req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            var tempPath = 'public/upload/temp/',
                ext = mimetype.split('/')[0];
            Models.Image.find({filename: filename}, function (err, images) {
                if(images.length > 0){
                    res.json(500, {error: 'Such image already exists'});
                } else {
                    if (ext == 'image') {
                        file.pipe(fs.createWriteStream(tempPath + filename));
                        var newImg = new Models.Image({
                            filename: filename,
                            title: '',
                            description: ''
                        });
                        req.busboy.on('field', function(fieldname, val) {
                            if(fieldname == 'title'){
                                newImg.title = val;
                            }
                        });
                        req.busboy.on('field', function(fieldname, val) {
                            if(fieldname == 'description'){
                                newImg.description = val;
                            }
                        });
                        req.busboy.on('finish', function() {
                            newImg.save(function (err, image) {
                                res.redirect('/images/' + image.filename);
                            });
                        })
                    } else {
                        res.json(500, {error: 'Only image files are allowed.'});
                    }
                }
            });
        });
        req.pipe(req.busboy);

    },

    like: function(req, res) {
        Models.Image.findOne({ filename: { $regex: req.params.image_id } },
            function(err, image) {
                if (!err && image) {
                    image.likes = image.likes + 1;
                    image.save(function(err) {
                        if (err) {
                            res.json(err);
                        } else {
                            res.json({ likes: image.likes });
                        }
                    });
                }
            });
    },
    comment: function(req, res) {
        Models.Image.findOne({ filename: { $regex: req.params.image_id } },
            function(err, image) {
                if (!err && image) {
                    var newComment = new Models.Comment(req.body);
                    newComment.image_id = image._id;
                    newComment.save(function(err, comment) {
                        if (err) { throw err; }
                        res.redirect('/images/' + image.uniqueId + '#' + comment._id);
                    });
                } else {
                    res.redirect('/');
                }
            });
    },
    remove: function(req, res){
        console.log('remove is clicked');
        Models.Image.findOne({ filename: { $regex: req.params.image_id }},
            function(err, image) {
                if (err) { throw err; }
                fs.unlink(path.resolve('./public/upload/temp/' + image.filename),
                    function(err) {
                        if (err) { throw err; }
                        Models.Comment.remove({ image_id: image._id},
                            function(err) {
                                image.remove(function(err) {
                                    if (!err) {
                                        res.send(true);
                                    } else {
                                        res.send(false);
                                    }
                                });
                            });
                    });
            });
    }


};
