'use strict';
var Promise = require('bluebird');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var constants = require('./../../constants');
var CARD_COLORS = constants.CARD_COLORS;
var CARD_VALUES = constants.CARD_VALUES;

var colors = Object.keys(CARD_COLORS).map(function(key) {
  return CARD_COLORS[key];
});
var values = Object.keys(constants.CARD_VALUES).map(function(key) {
  return CARD_VALUES[key];
});

var schema = Schema({
  color: { type: String, enum: colors },
  value: { type: String, enum: values },
  penalty: { type: Number },
  game: { type: ObjectId, ref: 'Game' }
});

schema.statics.shuffleCards = function shuffleCards(cards) {
  var clone = cards.slice(0);

  // Implement Knuth Shuffle
  var currentIndex = clone.length;
  var temporaryValue;
  var randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = clone[currentIndex];
    clone[currentIndex] = clone[randomIndex];
    clone[randomIndex] = temporaryValue;
  }
  return clone;
}

mongoose.model('Card', schema);
