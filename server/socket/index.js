'use strict';

var socketIo = require('socket.io');
var mongoose = require('mongoose');
var Game = mongoose.model('Game');
var Player = mongoose.model('Player');

module.exports = function setUpSockets(server) {
  var io = socketIo(server);
  addSocketConnectionCallback(io);
}

function addSocketConnectionCallback(io) {
  var board = io.of('/board');
  var player = io.of('/player');

  // Board socket
  board.on('connection', function(socket) {
    console.log('board connected');
    player.emit('gameCreated');

    socket.on('disconnect', function() {
      console.log('game ended');
      delete global.currentGameId;
    });
  });

  // Player socket
  player.on('connection', function(socket) {
    var player;
    console.log('player connected');

    socket.on('disconnect', function() {
      console.log('player left');
      if (!global.currentGameId) return;
      if (!player) return;

      Game.findOne({ _id: global.currentGameId })
        .populate('drawDeck').then((game) => {
        return game.removePlayer(player);
      }).then((game) => {
        return game.populate('players');
      }).then((game) => {
        board.emit('gameUpdate', game);
      })
    })

    socket.on('playerJoin', function(playerId) {
      player = playerId;
      if (!global.currentGameId) return;

      Game.findOne({ _id: global.currentGameId })
        .populate('drawDeck').then((game) => {
        return game.addPlayer(playerId);
      }).then((game) => {
        return game.populate('players');
      }).then((game) => {
        board.emit('gameUpdate', game);
      });
    });

    socket.on('playerReady', function() {
      if (!global.currentGameId) return;
      Game.findOne({ _id: global.currentGameId }).then((game) => {
        return game.checkReady();
      }).then((isReady) => {
        if (isReady) board.emit('gameReady');
      });
    });
  });



  // Global socket
  io.on('connection', function(socket) {
    console.log('new socket connection');
  });
}
