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

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}