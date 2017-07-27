'use strict';

var router = require('express').Router();
var mongoose = require('mongoose');
var Player = mongoose.model('Player');

module.exports = router;

router.post('/', function(req, res, next) {
  Player.create({}).then((player) => {
    res.json(player);
  }).catch(function(err) {
    next(err);
  });
});
