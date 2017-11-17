// [NOTE TO CHALLENGE AUTHOR] 
// I didn't have time for persistence in this exercise.  Also I ran out of time before doing and remaining todo comments.

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var genuuid = require('uid2');
var expressSession = require('express-session');
var path = require('path');
var nconf = require('nconf');
var debug = require('debug');

var routes = require('./routes/routes');
var ballotRoutes = require('./routes/ballot');
var voteRoutes = require('./routes/vote');

main();

function main() {
    var validOptions = ['--production', '-p'];
    var optionsInArgs = {};

    // check command line arguments for supported options
    process.argv.forEach(function (val, index, array) {
        // print args list
        //console.log(index + ': ' + val);

        if (index <= 1) {
            return; // same as continue in forEach
        }

        if (validOptions.indexOf(val) > -1) {
            optionsInArgs[val.replace(/-/g, '')] = true;
        }
    });

    if (optionsInArgs.production || optionsInArgs.p) {
        console.log('Active Build Mode: PRODUCTION');
        //app.use(express.static(path.join(__dirname + '/dist/public')));
    } else {
        console.log('Active Build Mode: DEVELOPMENT');
        //app.use(express.static(path.join(__dirname + '/public')));
    }
   
    app.use('/node_modules', express.static(path.join(__dirname + '/node_modules')));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));

    app.use(expressSession({
        genid: function (req) {
            return genuuid(62); // use UUIDs for session IDs
        },
        secret: 'secretkey',
        resave: false,
        saveUninitialized: true
    }));

    app.use('/', routes());
    app.use('/api', ballotRoutes());
    app.use('/api', voteRoutes());

    //This is 404 for API requests
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    //setup config file
    nconf.argv()
        .env()
        .file({
            file: './config.json'
        });

    var port = nconf.get('System:port');
    app.set('port', port);

    var server = app.listen(app.get('port'), function (req, res) {
        if (res) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
        }
        console.log('Express server listening on port ' + server.address().port);
    });
}
