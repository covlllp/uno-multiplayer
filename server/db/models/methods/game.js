import mongoose from 'mongoose';

import constants from './../../../constants';

const Card = mongoose.model('Card');
const Player = mongoose.model('Player');

const {
  CARD_COLORS,
  CARD_VALUES,
  DEAL_SIZE,
} = constants;

function addNewDeck() {
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
    this.drawDeck.push(...Card.shuffleCards(cards.map(card => card._id)));
    return this.save();
  });
}

function moveDiscardToDraw() {
  this.drawDeck.push(...Card.shuffleCards(this.discardDeck));
  this.discardDeck = [];
  return this.save;
}

function removePlayer(playerId) {
  const playerIndex = this.players.indexOf(playerId);
  if (playerIndex < 0) return Promise.reject('player not registered');

  this.players.splice(playerIndex, 1);
  return this.save();
}

function addPlayer(playerId) {
  if (this.players.indexOf(playerId) !== -1) return Promise.resolve();
  this.players.push(playerId);
  return this.save();
}

function _playerDraw(player, amount) {
  const drawnCards = this.drawDeck.splice(0, amount);
  player.cards.push(...drawnCards);
  return Promise.all([
    this.save(),
    player.save(),
  ]);
}

function _safePlayerDraw(player, amount) {
  const promiseCheck = [Promise.resolve()];
  if (this.drawDeck.length < amount) {
    promiseCheck.push(this.moveDiscardToDraw());
    if (this.drawDeck.length + this.discardDeck.length < amount) {
      promiseCheck.push(this.addNewDeck());
    }
  }
  return Promise.all(promiseCheck).then(() => this._playerDraw(player, amount));
}

function playerDraw(playerId, amount) {
  return this.playersDraw([playerId], amount);
}

function playersDraw(playerIds, amount) {
  const idCheck = playerIds.every(playerId => this.players.indexOf(playerId) !== -1);
  if (!idCheck) return Promise.reject('invalid player ids');

  return Player.find({
    _id: { $in: playerIds },
  }).then(players => players.reduce((chain, player) => (
    chain.then(() => this._safePlayerDraw(player, amount))
  ), Promise.resolve()))
    .then(() => this);
}

function getNextTurnIndex() {
  const numPlayers = this.players.length;
  const direction = this.reversedOrder ? -1 : 1;
  const newIndex = this.turn + direction;
  return newIndex < 0 ?
    (newIndex % numPlayers) + numPlayers :
    newIndex % numPlayers;
}

function playCard(playerId, cardId) {
  this.discardDeck.push(this.lastPlayedCard);
  this.lastPlayedCard = cardId;
  this.turn = this.getNextTurnIndex();
  return Promise.all([
    Player.findByIdAndUpdate(playerId, {
      $pull: { cards: cardId },
    }),
    this.save(),
  ]);
}

function dealCards() {
  return this.playersDraw(this.players, DEAL_SIZE);
}

function flipCard() {
  this.lastPlayedCard = this.drawDeck.shift();
  return this.save();
}

const methods = {
  addNewDeck,
  addPlayer,
  dealCards,
  flipCard,
  getNextTurnIndex,
  moveDiscardToDraw,
  playCard,
  _playerDraw,
  _safePlayerDraw,
  playerDraw,
  playersDraw,
  removePlayer,
};

export default methods;
