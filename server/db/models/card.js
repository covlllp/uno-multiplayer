import mongoose from 'mongoose';

import constants from './../../constants';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const {
  CARD_COLORS,
  CARD_VALUES,
} = constants;

const colors = Object.keys(CARD_COLORS).map(key => CARD_COLORS[key]);
const values = Object.keys(CARD_VALUES).map(key => CARD_VALUES[key]);

const schema = Schema({
  color: { type: String, enum: colors },
  value: { type: String, enum: values },
  penalty: { type: Number },
  game: { type: ObjectId, ref: 'Game' },
});

schema.statics.shuffleCards = function shuffleCards(cards) {
  const clone = cards.slice(0);

  // Implement Knuth Shuffle
  let currentIndex = clone.length;
  let temporaryValue = null;
  let randomIndex = null;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = clone[currentIndex];
    clone[currentIndex] = clone[randomIndex];
    clone[randomIndex] = temporaryValue;
  }
  return clone;
};

mongoose.model('Card', schema);
