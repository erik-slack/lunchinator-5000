var uuidv4 = require('uuid/v4');
var _ = require('lodash');
var utils = require('../utils');

module.exports = {
    Ballot: Ballot
}

function Ballot(ballotData) {
    this.voters = ballotData.voters;
    this.endTime = ballotData.endTime;
    this.ballotId = uuidv4();
    this.status = 'active';
    this.choices = [];
    this.winner = null;
    this.suggestion = null;
    this.getContestedBallot = function () {
        result = _.pick(this, 'suggestion', 'choices');
        result.choices = utils.shuffle(result.choices);
        return result;
    };
    this.getWonBallot = function () {
        return _.pick(this, 'winner', 'choices');
    };
    this.hasExpired = function () {
        // todo: write logic for this
        return false;
    };
}



