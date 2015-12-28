

var path = require('path'),
    routes = require('./routes'),
    exphbs = require('express-handlebars'),
    express = require('express'),
    busboy = require('connect-busboy'),
    multer = require('multer'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    morgan = require('morgan'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler'),
    moment = require('moment');

module.exports = function(app) {
    app.engine('handlebars', exphbs.create({
        defaultLayout: 'main',
        layoutsDir: app.get('views') + '/layouts',
        partialsDir: [app.get('views') + '/partials'],
        helpers: {
            timeago: function(timestamp) {
                return moment(timestamp).startOf('minute').fromNow();
            }
        }
    }).engine);
    app.set('view engine', 'handlebars');
    app.use(morgan('dev'));
    app.use(busboy());
    //app.use(bodyParser({
    //    uploadDir:path.join(__dirname, '../public/upload/temp')
    //}));
    app.use(methodOverride());
    app.use(cookieParser('some-secret-value-here'));
    routes.initialize(app, new express.Router());
    app.use('/public/', express.static(path.join(__dirname, '../public')));
    if ('development' === app.get('env')) {
        app.use(errorHandler());
    }
    return app;
};
