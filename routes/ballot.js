var express = require('express');
var routeUtils = require('./route_utilities');
var utils = require('../utils');
var router = express.Router();
var https = require('https');
var q = require('q');
var _ = require('lodash');

var Ballot = require('../models/ballot').Ballot;

module.exports = function () {
    router.post('/create-ballot', createBallot);
    router.get('/ballot/:ballotId', getBallotById); 
    router.get('/ballots', getAllBallots); 

    return router;
}

/*// Session Data //*/

var ballots = [];

/*// WSMs //*/

function createBallot(req, res) {
    var newBallot = new Ballot(req.body);

    getRestaurants()
        .then(function(data) {
            utils.pickRandomChoices(newBallot.choices, data, 5);
            ballots.push(newBallot);
        });
    
    res.send({
        ballotId: newBallot.ballotId
    });
}

function getBallotById(req, res) {
    // todo: if no ballotId param throw error
    res.send({
        wonBallot: newBallot.getWonBallot()
    });
    
}

function getAllBallots(req, res) {
    res.send({
        ballots: ballots
    });
}

/*// 3rd Party APIs //*/

function getRestaurants() {
    var deferred = q.defer();
    routeUtils.simplifiedHttpsGet('restaurants', onEndFunction, routeUtils.defaultOnErrFunction, routeUtils.defaultOnNon200Code);
    function onEndFunction (data) {
        deferred.resolve(JSON.parse(data));
    }
    return deferred.promise;
}

function getRestaurant(name) {
    var deferred = q.defer();
    routeUtils.simplifiedHttpsGet('restaurants/' + name, onEndFunction, routeUtils.defaultOnErrFunction, routeUtils.defaultOnNon200Code);
    function onEndFunction (data) {
        deferred.resolve(data);
    }
    return deferred.promise;
}