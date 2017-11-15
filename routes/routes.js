/***************************************************************************
    These routes are API routes only
***************************************************************************/

var express = require('express');
var router = express.Router();
var https = require('https');

var BASE_URL = 'localhost:3131';
var BASE_PATH = '/api/v1';

module.exports = function () {

    /* router.get('/', function (req, res) {
        // The main page to display
        res.render('index.html');
    }); */

    router.get('/', function (req, res) {
        // The main page to display
        res.send('hello world');
    });

    return router;
}