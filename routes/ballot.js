var express = require('express');
var router = express.Router();
var https = require('https');

module.exports = function () {

    router.get('/ballot/:ballotId', function (req, res) {
        res.send('hello world');
    });

    router.get('/create-ballot', function (req, res) {
        res.send('hello world');
    });

    return router;
}