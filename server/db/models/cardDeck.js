'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var schema = new Schema({
  cards: [{ type: ObjectId, ref: 'Card' }]
});

schema.methods.shuffle = function shuffle() {};

schema.methods.addCards = function addCards(cards) {};


mongoose.model('CardDeck', schema);
