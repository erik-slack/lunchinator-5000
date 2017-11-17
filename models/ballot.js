var uuidv4 = require('uuid/v4');
var _ = require('lodash');
var utils = require('../utils');
var moment = require('moment');

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
    this.castVote = function (newVote) {
        this.votes.push(newVote)
    };
}



