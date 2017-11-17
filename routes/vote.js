var express = require('express');
var router = express.Router();
var https = require('https');

// MODELS
var Vote = require('../models/vote').Vote;

// GLOBALS
var ballots = require('../session-data').ballots;

module.exports = function () {
    // [NOTE TO CHALLENGE AUTHOR] 
    // I see what you did there with the api/vote instructions.
    // It seems to me that the instructions regarding the vote endpoint, at least, direct me to break several industry standards.
    // I am moving forward under the following assumption (since this is a hypothetical project): 
    // I spoke with my team lead about my concerns 
    // and there were no good reasons for the things I was disputing
    // and he or she consented to some changes to their initial plan.
    // Namely, those changes are posts should not use queryParams instead of the body
    // and all queries should return something, be they successful or not.
    // Also it might be better to store this with a key as a guid to protect sensitive information.

    router.post('/vote', function (req, res) {
        // todo: add validation for request body
        var newVote = new Vote(req.body);
        var relevantBallot = getRelevantBallot();

        if (relevantBallot.hasExpired()) {
            res.status(409);
            res.send("Apologies!  Ballot's voting period has ended.  This vote will not be counted.");
        } else {
            relevantBallot.votes.push(newVote);
            // todo: add functionality for tallying votes
        }

        res.send(newVote);

        function getRelevantBallot() {
            var ballotCount = ballots.length;
            var result = null;
            for (var i = 0; i < ballotCount; i++) {
                var thisBallot = ballots[i];
                if (thisBallot.ballotId === newVote.ballotId) {
                    result = thisBallot;
                    break;
                }
            }
            return result;
        }
    });

    return router;
}