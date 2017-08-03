import mongoose from 'mongoose';

import gameMethods from './methods/game';
import gameStatics from './statics/game';

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Player = mongoose.model('Player');

const schema = new Schema({
  drawDeck: [{ type: ObjectId, ref: 'Card' }],
  discardDeck: [{ type: ObjectId, ref: 'Card' }],
  lastPlayedCard: { type: ObjectId, ref: 'Card' },
  turn: { type: Number, default: 0 },
  reversedOrder: { type: Boolean, default: false },
  players: [{ type: ObjectId, ref: 'Player' }],
});

schema.methods.playCard = function playCard(options) {
  const {
    cardId,
    playerId,
  } = options;
  const promises = [];
  promises.push(Player.findOne({ _id: playerId }).then((player) => {
    const cardIndex = player.cards.indexOf(cardId);
    player.cards.splice(cardIndex, 1);
    return player.save();
  }));
  this.discardDeck.push(cardId);
  promises.push(this.save());
  return Promise.all(promises).then(() => this);
};

schema.methods = gameMethods;
schema.statics = gameStatics;

mongoose.model('Game', schema);
