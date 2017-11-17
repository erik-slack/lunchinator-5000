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

var NUM_OF_CHOICES = 5;
var ballots = [];

/*// WSMs //*/

function createBallot(req, res) {
    var newBallot = new Ballot(req.body);

    addChoices(newBallot, addSuggestion);

    function addChoices() {
        getRestaurants()
            .then(function(data) {
                utils.pickRandomChoices(newBallot.choices, data, NUM_OF_CHOICES);
                populateChoicesWithAverageReviews();
            });
    }

    function populateChoicesWithAverageReviews() {
        var responseCount = 0;
        var reviewsMerged = [];
        for (var i = 0; i < NUM_OF_CHOICES; i++) {
            getReview(newBallot.choices[i].name, i)
                .then(function(result) {
                    newBallot.choices[result.iterator].averageReview = calculateAverageRating(newBallot.choices[result.iterator], result.data);
                    reviewsMerged = reviewsMerged.concat(result.data);
                    responseCount++;
                    if (responseCount === NUM_OF_CHOICES) {
                        addSuggestion(reviewsMerged);
                    }
                });
        }
    }

    function calculateAverageRating(choiceToUpdate, reviews) {
        var ratingsArray = [];
        var numOfReviews = reviews.length;
        for (var j = 0; j < numOfReviews; j++) {
            ratingsArray.push(parseInt(reviews[j].rating));
        }
        return _.round(_.mean(ratingsArray), 2);
    }

    function addSuggestion(relevantReviews) {
        var highestRatedChoiceIndex = 0;
        var highestRatingReviewIndex = -1;
        for (var i = 1; i < NUM_OF_CHOICES; i++) {
            var thisChoice = newBallot.choices[i];
            var previousChoice = newBallot.choices[i - 1];
            if (thisChoice.averageReview > previousChoice.averageReview) {
                highestRatedChoiceIndex = i;
            }
        }
        var reviewsCount = relevantReviews.length;
        for (var i = 0; i < reviewsCount; i++) {
            if (relevantReviews[i].restaurant === newBallot.choices[highestRatedChoiceIndex].name) {
                if (highestRatingReviewIndex === -1 || (parseInt(relevantReviews[i].rating) > parseInt(relevantReviews[highestRatingReviewIndex].rating))) {
                    highestRatingReviewIndex = i;
                }
            }
        }
        newBallot.suggestion = _.pick(newBallot.choices[highestRatedChoiceIndex], 'id', 'name', 'averageReview');
        newBallot.suggestion.topReviewer = relevantReviews[highestRatingReviewIndex].reviewer;
        newBallot.suggestion.review = relevantReviews[highestRatingReviewIndex].review;
        onBallotCompleted();
    }

    function onBallotCompleted() {
        ballots.push(newBallot);
        res.send({
            ballotId: newBallot.ballotId
        });
    }
}

function getBallotById(req, res) {
    // todo: if no ballotId param throw error
    var relevantBallot = null;
    if (relevantBallot.hasExpired()) {
        relevantBallot = newBallot.getContestedBallot();
    } else {
        relevantBallot = newBallot.getWonBallot();
    }
    res.send();
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
    routeUtils.simplifiedHttpsGet('restaurants/' + encodeURIComponent(name), onEndFunction, routeUtils.defaultOnErrFunction, routeUtils.defaultOnNon200Code);
    function onEndFunction (data) {
        deferred.resolve(data);
    }
    return deferred.promise;
}

function getReviews(name) {
    var deferred = q.defer();
    routeUtils.simplifiedHttpsGet('reviews', onEndFunction, routeUtils.defaultOnErrFunction, routeUtils.defaultOnNon200Code);
    function onEndFunction (data) {
        deferred.resolve(JSON.parse(data));
    }
    return deferred.promise;
}

function getReview(name, iterator) {
    var deferred = q.defer();
    routeUtils.simplifiedHttpsGet('reviews/' + encodeURIComponent(name), onEndFunction, routeUtils.defaultOnErrFunction, routeUtils.defaultOnNon200Code);
    function onEndFunction (data) {
        deferred.resolve({
            data: JSON.parse(data),
            iterator: iterator
        });
    }
    return deferred.promise;
}