import mongoose from 'mongoose';
import socketIo from 'socket.io';

const Game = mongoose.model('Game');

function addSocketConnectionCallback(io) {
  const board = io.of('/board');
  const player = io.of('/player');

  // Board socket
  board.on('connection', (socket) => {
    console.log('board connected');

    socket.on('disconnect', () => {
      console.log('game ended');
      delete global.currentGameId;
      player.emit('gameEnded');
    });

    socket.on('gameCreated', (gameId) => {
      Game.getPopulatedGame(gameId).then((game) => {
        player.emit('gameCreated', game);
      });
    });

    socket.on('gameUpdate', (gameId) => {
      Game.getPopulatedGame(gameId).then((game) => {
        player.emit('gameUpdate', game);
      });
    });
  });

  // Player socket
  player.on('connection', (socket) => {
    let socketPlayerId = null;
    console.log('player connected');

    socket.on('disconnect', () => {
      console.log('player left');
      if (!global.currentGameId) return;
      if (!socketPlayerId) return;

      Game.removePlayerAndPopulate(global.currentGameId, socketPlayerId)
        .then((game) => {
          board.emit('gameUpdate', game);
        }).catch((err) => {
          console.log('error caught: ', err);
        });
    });

    socket.on('playerJoin', (playerId) => {
      console.log(`player ${playerId} joined`);
      socketPlayerId = playerId;
      if (!global.currentGameId) return;

      Game.addPlayerAndPopulate(global.currentGameId, playerId)
        .then((game) => {
          board.emit('gameUpdate', game);
          player.emit('gameUpdate', game);
        }).catch((err) => {
          console.log('error caught: ', err);
        });
    });

    socket.on('playerReady', (gameId) => {
      if (!gameId) return;
      Game.checkReadyById(gameId)
        .then((isReady) => {
          if (isReady) board.emit('gameReady');
        });
    });

    socket.on('gameUpdate', (gameId) => {
      Game.getPopulatedGame(gameId).then((game) => {
        board.emit('gameUpdate', game);
        player.emit('gameUpdate', game);
      });
    });
  });


  // Global socket
  io.on('connection', () => {
    console.log('new socket connection');
  });
}

export default function setUpSockets(server) {
  const io = socketIo(server);
  addSocketConnectionCallback(io);
}
