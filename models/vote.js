var uuidv4 = require('uuid/v4');
var _ = require('lodash');
var utils = require('../utils');

module.exports = {
    Vote: Vote
}

function Vote(voteData) {
    this.restaurantId = voteData.restaurantId;
    this.ballotId = voteData.ballotId;
    this.voterName = voteData.voterName;
    this.emailAddress = voteData.emailAddress;
}



