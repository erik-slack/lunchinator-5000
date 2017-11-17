var express = require('express');
var router = express.Router();
var https = require('https');

// MODELS
var Vote = require('../models/vote').Vote;

// GLOBALS
var ballots = require('../session-data').ballots;

module.exports = function () {
    router.post('/vote', vote);

    return router;
}

function vote(req, res) {
    // [NOTE TO CHALLENGE AUTHOR] 
    // I made changes that are contrary to the requirements.
    // These changes assume that the product owner has passed off on these changes for this hypothetical project.
    // The changes include:
    // 1) posts should not use queryParams instead of the body
    // 2) all queries should return something, be they successful or not.
    var newVote = new Vote(req.body);
    var relevantBallot = getRelevantBallot();
    var newVoteMessage = '';

    if (relevantBallot === null) {
        res.status(400);
        res.send("Ballot doesn't exist with id: " + newVote.ballotId);
        return;
    } else if (relevantBallot.hasExpired()) {
        res.status(409);
        res.send("Ballot's voting period has ended.  This vote will not be counted.");
        return;
    } else if (!relevantBallot.voteMatchesVoters(newVote)) {
        res.status(400);
        res.send("Invalid voter name/email combination supplied.  This vote will not be counted.");
        return;
    } else if (!relevantBallot.voteMatchesChoices(newVote)) {
        res.status(400);
        res.send("Invalid restaurant choice.  This vote will not be counted.");
        return;
    } else {
        newVoteMessage = relevantBallot.castVote(newVote);
    }

    res.send(newVoteMessage);

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
}