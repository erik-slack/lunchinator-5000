var uuidv4 = require('uuid/v4');
var _ = require('lodash');
var utils = require('../utils');
var moment = require('moment');

// GLOBALS
var NUM_OF_CHOICES = require('../constants').NUM_OF_CHOICES;

module.exports = {
    Ballot: Ballot
}

function Ballot(ballotData) {
    this.voters = ballotData.voters;
    this.endTime = ballotData.endTime;
    this.ballotId = uuidv4();
    this.expired = false;
    this.choices = [];
    this.winner = null;
    this.suggestion = null;
    this.votes = [];
    this.getContestedBallot = function () {
        result = _.pick(this, 'suggestion', 'choices');
        result.choices = utils.shuffle(result.choices);
        return result;
    };
    this.getWonBallot = function () {
        return _.pick(this, 'winner', 'choices');
    };
    this.hasExpired = function () {
        if (this.expired) {
            return false;
        }

        var convertedEndTime = moment(this.endTime, 'M/D/YY H:m').format();
        if (moment().diff(convertedEndTime, 'seconds') >= 0) {
            this.expired = true;
        }
        return this.expired;
    };
    this.validateVote = function (vote) {
        var voteIsValid = true;
        if (this.hasExpired(vote) || !this.voteMatchesVoters(vote) || !this.voteMatchesChoices(vote)) {
            voteIsValid = false;
        }
        return voteIsValid;
    };
    this.voteMatchesVoters = function (vote) {
        // This is case sensitive
        var result = false;
        var voterCount = this.voters.length;
        for (var i = 0; i < voterCount; i++) {
            var thisVoter = this.voters[i];
            if (vote.voterName === thisVoter.name && vote.emailAddress === thisVoter.emailAddress) {
                result = true;
            }
        }
        return result;
    };
    this.voteMatchesChoices = function (vote) {
        // This must be a number not a string
        var result = false;
        console.log('NUM_OF_CHOICES', NUM_OF_CHOICES);
        for (var i = 0; i < NUM_OF_CHOICES; i++) {
            var thisChoice = this.choices[i];
            console.log('thisChoice.id', thisChoice.id);
            console.log('vote.restaurantId', vote.restaurantId);
            if (vote.restaurantId === thisChoice.id) {
                result = true;
            }
        }
        return result;
    };
    this.castVote = function (newVote) {
        var voteCounted = true;
        if (this.validateVote(newVote)) {
            voteCounted = false;
        }
        if (voteCounted) {
            this.votes.push(newVote);
        }
        return voteCounted;
    };
    this.tallyVotes = function () {

    };
}



