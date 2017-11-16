/***************************************************************************
    These routes are API routes only
***************************************************************************/

var express = require('express');
var router = express.Router();
var https = require('https');

module.exports = function () {

    /* router.get('/', function (req, res) {
        // The main page to display
        res.render('index.html');
    }); */

    router.get('/', function (req, res) {
        res.send('hello world');
    });

    return router;
}