import mongoose from 'mongoose';

import gameMethods from './methods/game';
import gameStatics from './statics/game';

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Card = mongoose.model('Card');

const schema = new Schema({
  drawDeck: [{ type: ObjectId, ref: 'Card' }],
  discardDeck: [{ type: ObjectId, ref: 'Card' }],
  lastPlayedCard: { type: ObjectId, ref: 'Card' },
  turnInfo: { type: Card.schema },
  turn: { type: Number, default: 0 },
  reversedOrder: { type: Boolean, default: false },
  players: [{ type: ObjectId, ref: 'Player' }],
});

schema.methods = gameMethods;
schema.statics = gameStatics;

mongoose.model('Game', schema);
