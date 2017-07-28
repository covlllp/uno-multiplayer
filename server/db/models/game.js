'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Card = mongoose.model('Card');
var Player = mongoose.model('Player');

var constants = require('./../../constants');
var CARD_COLORS = constants.CARD_COLORS;
var CARD_VALUES = constants.CARD_VALUES;

var schema = new Schema({
  drawDeck: [{ type: ObjectId, ref: 'Card' }],
  discardDeck: [{ type: ObjectId, ref: 'Card' }],
  lastPlayedCard: { type: ObjectId, ref: 'Card' },
  turn: { type: Number, default: 0 },
  reversedOrder: { type: Boolean, default: false },
  players: [{ type: ObjectId, ref: 'Player' }]
});


schema.methods.addNewDeck = function addNewDeck() {
  var that = this;
  var createdCardPromises = [];
  Object.keys(CARD_COLORS).forEach(function(colorKey) {
    var color = CARD_COLORS[colorKey]
    if (color === CARD_COLORS.WILD) {
      createdCardPromises.push(new Card({
        color: CARD_COLORS.WILD,
        value: CARD_VALUES.ZERO,
        penalty: 0,
        game: that._id
      }).save());
      createdCardPromises.push(new Card({
        color: CARD_COLORS.WILD,
        value: CARD_VALUES.FOUR,
        penalty: 4,
        game: that._id
      }).save());
    } else {
      Object.keys(CARD_VALUES).forEach(function(valueKey) {
        var value = CARD_VALUES[valueKey]
        var times = value === CARD_VALUES.ZERO ? 1 : 2;
        for (var i = 0; i < times; i++) {
          var penalty = value === CARD_VALUES.DRAW ? 2 : 0;
          createdCardPromises.push(new Card({
            color: color,
            value: value,
            penalty: penalty,
            game: that._id
          }).save())
        }
      });
    }
  });

  return Promise.all(createdCardPromises).then(function(cards) {
    that.drawDeck = that.drawDeck.concat(Card.shuffleCards(cards.map(card => card._id)));
    return that.save();
  });
}

schema.methods.playerDraw = function playerDraw(player, amount) {
  var drawnCards = this.drawDeck.splice(0, amount);
  player.cards = player.cards.concat(drawnCards);
  var promises = [
    this.save(),
    player.save(),
  ];
  return Promise.all(promises);
}

schema.methods.playersDraw = function playersDraw(playerIds, amount) {
  var that = this;
  var validPlayerIds = playerIds.every(function(playerId) {
    return that.players.indexOf(playerId) !== -1;
  });
  if (!validPlayerIds) return Promise.reject();

  return Player.find({
    _id: { $in: playerIds }
  }).then(function(players) {
    return players.reduce(function(chain, player) {
      return chain.then(() => {
        return that.playerDraw(player, amount);
      });
    }, Promise.resolve());
  }).then(function() {
    return that;
  });
}

schema.methods.dealCards = function dealCards() {
  return this.playersDraw(this.players, constants.DEAL_SIZE);
}

schema.methods.flipCard = function flipCard() {
  this.lastPlayedCard = this.drawDeck.shift();
  return this.save();
}


schema.methods.updatePlayers = function updatePlayers() {
  var that = this;
  return Player.find({
    _id: { $in: this.players }
  }).then(function(players) {
    that.players = players;
    return that.save();
  });
}

schema.methods.addPlayer = function addPlayer(playerId) {
  this.players.push(playerId)
  return this.updatePlayers();
}

schema.methods.removePlayer = function removePlayer(playerId) {
  var playerIndex = this.players.indexOf(playerId);
  if (playerIndex < 0) return Promise.reject('player not registered');

  this.players.splice(playerIndex, 1);
  return this.updatePlayers();
}

schema.methods.checkReady = function checkReady() {
  if (this.players.length < 2) return Promise.resolve(false);
  return Player.find({ _id: { $in: this.players } }).then(function(players) {
    return players.every(function(player) {
      return player.isReady;
    });
  });
}

schema.methods.playCard = function playCard(options) {
  var that = this;
  var cardId = options.cardId;
  var playerId = options.playerId;
  var promises = [];
  promises.push(Player.findOne({ _id: playerId }).then(function(player) {
    var cardIndex = player.cards.indexOf(cardId);
    player.cards.splice(cardIndex, 1);
    return player.save();
  }));
  this.discardDeck.push(cardId);
  promises.push(this.save());
  return Promise.all(promises).then(function() {
    return that;
  });
}

schema.methods.populateFields = function populateFields() {
  var that = this;
  var promises = [];
  promises.push(Player.find({
    _id: { $in: this.players }
  }).populate('cards').exec().then(function(players) {
    that.players = players;
    return that;
  }));
  promises.push(Card.findOne({ _id: this.lastPlayedCard }).then(function(card) {
    that.lastPlayedCard = card;
    return that;
  }));
  return Promise.all(promises).then(function() {
    return that;
  });
}


mongoose.model('Game', schema);
