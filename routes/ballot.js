var express = require('express');
var router = express.Router();
var https = require('https');

var BASE_URL = 'localhost:3131';
var BASE_PATH = '/api';

module.exports = function () {

    router.get('/', function (req, res) {
        res.send('hello world');
    });

    return router;
}