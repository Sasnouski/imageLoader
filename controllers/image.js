
var fs = require('fs'),
    path = require('path'),
    sidebar = require('../helpers/sidebar');
module.exports = {
    index: function(req, res) {
        var viewModel = {
            image: {
                uniqueId: 1,
                title: 'Sample Image 1',
                description: 'This is a sample.',
                filename: 'sample1.jpg',
                views: 0,
                likes: 0,
                timestamp: Date.now
            },
            comments: [
                {
                    image_id: 1,
                    email: 'test@testing.com',
                    name: 'Test Tester',
                    gravatar: 'http://lorempixel.com/75/75/animals/1',
                    comment: 'This is a test comment...',
                    timestamp: Date.now()
                },{
                    image_id: 1,
                    email: 'test@testing.com',
                    name: 'Test Tester',
                    gravatar: 'http://lorempixel.com/75/75/animals/2',
                    comment: 'Another followup comment!',
                    timestamp: Date.now()
                }
            ]
        };
        sidebar(viewModel, function(viewModel) {
            res.render('image', viewModel);
        });
    },
    create: function(req, res) {

        req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            var tempPath = 'public/upload/temp/';
            var ext = mimetype.split('/')[0];
            //console.log('ext is ' + ext);
            if (ext == 'image') {
                console.log('Uploading: ' + filename);
                file.pipe(fs.createWriteStream(tempPath + filename));

            } else {
                console.log('Fail');
                res.json(500, {error: 'Only image files are allowed.'});
            }
        req.busboy.on('finish', function() {

            res.redirect(tempPath  + filename);
            //res.writeHead(200, { 'Connection': 'close' });
            //res.end("That's all folks!");
        });

        });

        //res.redirect('/images/');
        req.pipe(req.busboy);

    },

    like: function(req, res) {
        res.json({likes: 1});
    },
    comment: function(req, res) {
        res.send('The image:comment POST controller');
    }
};
