var _ = require('lodash');

module.exports = {
    pickRandomChoices: pickRandomChoices
}

function pickRandomChoices(targetArray, allChoices, numOfChoices) {
    var allChoicesCount = allChoices.length;
    for (var i = 0; i < numOfChoices; i++) {
        var randomIndex = _.random(0, allChoicesCount - 1, false);
        targetArray.push(allChoices[randomIndex]);
    }
}