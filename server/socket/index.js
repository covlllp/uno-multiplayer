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
    });

    socket.on('gameCreated', () => {
      player.emit('gameCreated');
    });

    socket.on('gameUpdate', () => {
      Game.findOne({ _id: global.currentGameId }).populate({
        path: 'players',
        model: 'Player',
        populate: {
          path: 'cards',
          model: 'Card',
        },
      }).then((game) => {
        player.emit('gameUpdate', game);
      });
    });
  });

  // Player socket
  player.on('connection', (socket) => {
    let socketPlayer = null;
    console.log('player connected');

    socket.on('disconnect', () => {
      console.log('player left');
      if (!global.currentGameId) return;
      if (!socketPlayer) return;

      Game.findOne({ _id: global.currentGameId })
        .then(game => game.removePlayer(player))
        .then((game) => {
          board.emit('gameUpdate', game);
        }).catch((err) => {
          console.log('error caught: ', err);
        });
    });

    socket.on('playerJoin', (playerId) => {
      console.log(`player ${playerId} joined`);
      socketPlayer = playerId;
      if (!global.currentGameId) return;

      Game.findOne({ _id: global.currentGameId })
        .then(game => game.addPlayer(playerId))
        .then((game) => {
          board.emit('gameUpdate', game);
        }).catch((err) => {
          console.log('error caught: ', err);
        });
    });

    socket.on('playerReady', () => {
      if (!global.currentGameId) return;
      Game.findOne({ _id: global.currentGameId }).then(game => game.checkReady())
        .then((isReady) => {
          if (isReady) board.emit('gameReady');
        });
    });

    socket.on('gameUpdate', () => {
      console.log('player game update');
      Game.findOne({ _id: global.currentGameId }).then(game => game.populateFields())
        .then((game) => {
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
