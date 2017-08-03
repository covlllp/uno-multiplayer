function getPopulatedGame(id) {
  return this.findById(id)
    .populate({
      path: 'players',
      model: 'Player',
      populate: {
        path: 'cards',
        model: 'Card',
      },
    })
    .populate('lastPlayedCard')
    .exec();
}

function startGame(id) {
  return this.findById(id)
    .then(game => game.dealCards())
    .then(game => game.flipCard())
    .then(() => this.getPopulatedGame(id))
    .catch((err) => {
      console.log('static error', err);
    });
}

function checkReadyById(id) {
  return this.findById(id)
    .populate('players')
    .exec()
    .then((game) => {
      if (game.players.length < 2) return false;
      return game.players.every(player => player.isReady);
    });
}

function addPlayerAndPopulate(gameId, playerId) {
  return this.findById(gameId)
    .then(game => game.addPlayer(playerId))
    .then(() => this.getPopulatedGame(gameId))
    .catch((err) => {
      console.log('static error', err);
    });
}

function removePlayerAndPopulate(gameId, playerId) {
  return this.findById(gameId)
    .then(game => game.removePlayer(playerId))
    .then(() => this.getPopulatedGame(gameId))
    .catch((err) => {
      console.log('static error', err);
    });
}

function playCardByPlayer(gameId, options) {
  const { playerId, cardId } = options;
  return this.findById(gameId)
    .then(game => game.playCard(playerId, cardId))
    .then(() => this.getPopulatedGame(gameId))
    .catch((err) => {
      console.log('static error', err);
    });
}

const statics = {
  addPlayerAndPopulate,
  checkReadyById,
  getPopulatedGame,
  playCardByPlayer,
  removePlayerAndPopulate,
  startGame,
};

export default statics;
