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

router.put('/:id', function(req, res, next) {
  var id = req.params.id;
  var body = req.body;
  Player.findOneAndUpdate({ _id: id }, body, { new: true }).then((player) => {
    res.json(player);
  });
});
