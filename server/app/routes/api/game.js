'use strict';

var router = require('express').Router();
var mongoose = require('mongoose');
var Game = mongoose.model('Game');
var Card = mongoose.model('Card');

module.exports = router;

router.post('/create', function(req, res, next) {
  if (global.currentGameId) {
    res.status(403).end();
    return;
  }

  var newGame = new Game({});
  newGame.addNewDeck().then(function(game) {
    return game.populate('drawDeck');
  }).then(function(game) {
    global.currentGameId = game._id;
    res.json(game);
  }).catch(function(err) {
    next(err);
  });
});
