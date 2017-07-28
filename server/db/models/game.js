import mongoose from 'mongoose';

import constants from './../../constants';

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Card = mongoose.model('Card');
const Player = mongoose.model('Player');

const {
  CARD_COLORS,
  CARD_VALUES,
} = constants;

const schema = new Schema({
  drawDeck: [{ type: ObjectId, ref: 'Card' }],
  discardDeck: [{ type: ObjectId, ref: 'Card' }],
  lastPlayedCard: { type: ObjectId, ref: 'Card' },
  turn: { type: Number, default: 0 },
  reversedOrder: { type: Boolean, default: false },
  players: [{ type: ObjectId, ref: 'Player' }],
});


schema.methods.addNewDeck = function addNewDeck() {
  const { _id } = this;
  const createdCardPromises = [];
  Object.keys(CARD_COLORS).forEach((colorKey) => {
    const color = CARD_COLORS[colorKey];
    if (color === CARD_COLORS.WILD) {
      createdCardPromises.push(new Card({
        color: CARD_COLORS.WILD,
        value: CARD_VALUES.ZERO,
        penalty: 0,
        game: _id,
      }).save());
      createdCardPromises.push(new Card({
        color: CARD_COLORS.WILD,
        value: CARD_VALUES.FOUR,
        penalty: 4,
        game: _id,
      }).save());
    } else {
      Object.keys(CARD_VALUES).forEach((valueKey) => {
        const value = CARD_VALUES[valueKey];
        const times = value === CARD_VALUES.ZERO ? 1 : 2;
        for (let i = 0; i < times; i += 1) {
          const penalty = value === CARD_VALUES.DRAW ? 2 : 0;
          createdCardPromises.push(new Card({
            color,
            value,
            penalty,
            game: _id,
          }).save());
        }
      });
    }
  });

  return Promise.all(createdCardPromises).then((cards) => {
    this.drawDeck = this.drawDeck.concat(Card.shuffleCards(cards.map(card => card._id)));
    return this.save();
  });
};

schema.methods.playerDraw = function playerDraw(player, amount) {
  const drawnCards = this.drawDeck.splice(0, amount);
  player.cards.push(...drawnCards);
  const promises = [
    this.save(),
    player.save(),
  ];
  return Promise.all(promises);
};

schema.methods.playersDraw = function playersDraw(playerIds, amount) {
  const validPlayerIds = playerIds.every(playerId => this.players.indexOf(playerId) !== -1);
  if (!validPlayerIds) return Promise.reject();

  return Player.find({
    _id: { $in: playerIds },
  }).then(players => players.reduce((chain, player) => (
    chain.then(() => this.playerDraw(player, amount))
  ), Promise.resolve()))
    .then(() => this);
};

schema.methods.dealCards = function dealCards() {
  return this.playersDraw(this.players, constants.DEAL_SIZE);
};

schema.methods.flipCard = function flipCard() {
  this.lastPlayedCard = this.drawDeck.shift();
  return this.save();
};


schema.methods.updatePlayers = function updatePlayers() {
  return Player.find({
    _id: { $in: this.players },
  }).then((players) => {
    this.players = players;
    return this.save();
  });
};

schema.methods.addPlayer = function addPlayer(playerId) {
  this.players.push(playerId);
  return this.updatePlayers();
};

schema.methods.removePlayer = function removePlayer(playerId) {
  const playerIndex = this.players.indexOf(playerId);
  if (playerIndex < 0) return Promise.reject('player not registered');

  this.players.splice(playerIndex, 1);
  return this.updatePlayers();
};

schema.methods.checkReady = function checkReady() {
  if (this.players.length < 2) return Promise.resolve(false);
  return Player.find({ _id: { $in: this.players } }).then(players => (
    players.every(player => player.isReady)
  ));
};

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

schema.methods.populateFields = function populateFields() {
  const promises = [];
  promises.push(Player.find({
    _id: { $in: this.players },
  }).populate('cards').exec().then((players) => {
    this.players = players;
    return this;
  }));
  promises.push(Card.findOne({ _id: this.lastPlayedCard }).then((card) => {
    this.lastPlayedCard = card;
    return this;
  }));
  return Promise.all(promises).then(() => this);
};


mongoose.model('Game', schema);
