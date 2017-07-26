'use strict';

var router = require('express').Router();
var mongoose = require('mongoose');
var Game = mongoose.model('Game');
var Card = mongoose.model('Card');

module.exports = router;

router.get('/start', function(req, res, next) {
  var newGame = new Game({});
  newGame.addNewDeck().then(function(game) {
    return game.save();
  }).then(function(game) {
    return game.populate('drawDeck');
  }).then(function(game) {
    res.json(game);
  }).catch(function(err) {
    next(err);
  });
});
