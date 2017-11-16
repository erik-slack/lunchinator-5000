var express = require('express');
var router = express.Router();
var https = require('https');

module.exports = function () {

    router.get('/vote', function (req, res) {
        res.send('hello world');
    });

    return router;
}