var uuidv4 = require('uuid/v4');
var _ = require('lodash');

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
        return _.pick(this, 'suggestion', 'choices');
    };
    this.getWonBallot = function () {
        return _.pick(this, 'winner', 'choices');
    };
}



