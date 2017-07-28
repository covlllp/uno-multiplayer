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
    global.currentGameId = game._id;
    res.json(game);
  }).catch(function(err) {
    next(err);
  });
});

router.put('/deal/:id', function(req, res, next) {
  Game.findOne({ _id: req.params.id }).then(function(game) {
    return game.dealCards();
  }).then(function(game) {
    return game.populateFields();
  }).then(function(game) {
    res.json(game);
  }).catch(function(err) {
    next(err);
  });
});
