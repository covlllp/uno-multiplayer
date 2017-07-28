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

    socket.on('disconnect', function() {
      console.log('game ended');
      delete global.currentGameId;
    });

    socket.on('gameCreated', function() {
      player.emit('gameCreated');
    });

    socket.on('gameUpdate', function() {
      Game.findOne({ _id: global.currentGameId }).populate({
        path: 'players',
        model: 'Player',
        populate: {
          path: 'cards',
          model: 'Card'
        }
      }).then((game) => {
        player.emit('gameUpdate', game);
      });
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
        .then((game) => {
        return game.removePlayer(player);
      }).then((game) => {
        board.emit('gameUpdate', game);
      }).catch((err) => {
        console.log('error caught: ', err);
      });
    });

    socket.on('playerJoin', function(playerId) {
      console.log('player ' + playerId + ' joined')
      player = playerId;
      if (!global.currentGameId) return;

      Game.findOne({ _id: global.currentGameId })
      .then((game) => {
        return game.addPlayer(playerId);
      }).then((game) => {
        board.emit('gameUpdate', game);
      }).catch((err) => {
        console.log('error caught: ', err);
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

    socket.on('gameUpdate', function() {
      console.log('player game update')
      Game.findOne({ _id: global.currentGameId }).then((game) => {
        return game.populateFields();
      }).then((game) => {
        board.emit('gameUpdate', game);
        player.emit('gameUpdate', game);
      });
    });
  });



  // Global socket
  io.on('connection', function(socket) {
    console.log('new socket connection');
  });
}
