'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CardDeck = mongoose.model('CardDeck');
var ObjectId = Schema.ObjectId;

var schema = new Schema({
  drawDeck: { type: CardDeck.schema },
  discardDeck: [{ type: ObjectId, ref: 'Card' }],
  turn: { type: Number },
  reversedOrder: { type: Boolean },
  players: [{ type: ObjectId, ref: 'Player' }]
});

mongoose.model('Game', schema);
