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
        for (var i = 0; i < NUM_OF_CHOICES; i++) {
            var thisChoice = this.choices[i];
            if (vote.restaurantId === thisChoice.id) {
                result = true;
                break;
            }
        }
        return result;
    };
    this.findVote = function (newVote) {
        var foundIndex = -1;
        var voteCount = this.votes.length;
        for (var i = 0; i < voteCount; i++) {
            var thisVote = this.votes[i];
            if (thisVote.voterName === newVote.voterName) {
                foundIndex = i;
                break;
            }
        }
        return foundIndex;
    };
    this.castVote = function (newVote) {
        var voteHandledMessage = 'Your vote has been counted.';
        var voterAlreadyVotedIndex = this.findVote(newVote); // -1 if no dupe vote found
        if (voterAlreadyVotedIndex !== -1) {
            this.votes.splice(newVote);
            voteHandledMessage = 'Previous vote overwritten by new vote.';
        } else {
            this.votes.push(newVote);
        }
        return voteHandledMessage;
    };
    this.tallyVotes = function () {
        var choicesMap = {};
        for (var i = 0; i < NUM_OF_CHOICES; i++) {
            var thisChoice = this.choices[i];
            choicesMap[thisChoice.id] = i;
        }
        var votesCount = this.votes.length;
        for (var i = 0; i < votesCount; i++) {
            var thisVote = this.votes[i];
            var relevantChoice = this.choices[choicesMap[thisVote.restaurantId]];
            relevantChoice.votes++;
        }
        determineWinner();
    };
    this.determineWinner = function () {
        var winningChoiceIndex = 0;
        var leadingVotesNumber = 0;
        for (var i = 0; i < NUM_OF_CHOICES; i++) {
            var thisChoice = this.choices[i];
            if (thisChoice.votes > leadingVotesNumber) {
                leadingVotesNumber = thisChoice.votes;
                winningChoiceIndex = i;
            }
        }
        this.winner = this.choices[winningChoiceIndex];
        this.winner.datetime = this.endTime;
    };
}
