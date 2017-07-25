'use strict';

var socketIo = require('socket.io');

module.exports = function setUpSockets(server) {
  var io = socketIo(server);
  addSocketConnectionCallback(io);
}

function addSocketConnectionCallback(io) {
  io.on('connection', function(socket) {
    console.log('someone connected');
    socket.on('disconnect', function() {
      console.log('someone disconnected');
    });
  });
}
