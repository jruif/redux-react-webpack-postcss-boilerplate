var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev');
var fs = require('fs');
var exec = require('child_process').exec;
var app = express();
var compiler = webpack(config);
// var bodyParser = require('body-parser');
var port = 9000;

var handlers = [
    //express.static(__dirname + '/dist'),
    require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: config.output.publicPath
    }),
    require('webpack-hot-middleware')(compiler),
    //bodyParser.urlencoded({extended: true}),
    //bodyParser.json()
];

function mySuperMiddleware(req, res, next) {
    function run(index) {
        if (index < handlers.length) {
            handlers[index](req, res, function (err) {
                if (err) {
                    return next(err);
                }
                index += 1;
                run(index);
            });
        } else {
            next();
        }
    }
    run(0);
}

app.use(mySuperMiddleware);


//app.use('/static', express.static(__dirname + '/dist'));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './app/index.html'));
});

app.listen(port, function (error) {
    if (error) {
        console.error(error);
    } else {
        console.info("open ==> http://localhost:%s/ ", port);
        exec('open http://localhost:' + port);
    }
});
