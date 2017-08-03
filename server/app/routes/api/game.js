import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();
const Game = mongoose.model('Game');

router.post('/create', (req, res, next) => {
  if (global.currentGameId) {
    res.status(403).end();
    return;
  }

  const newGame = new Game({});
  newGame.addNewDeck().then((game) => {
    const { _id } = game;
    global.currentGameId = _id;
    res.json(game);
  }).catch((err) => {
    next(err);
  });
});

router.put('/playCard/:id', (req, res, next) => {
  Game.findOne({ _id: req.params.id })
    .then(game => game.playCard(req.body))
    .then(game => game.populateFields())
    .then((game) => {
      res.json(game);
    })
    .catch((err) => {
      next(err);
    });
});

router.put('/start/:id', (req, res, next) => {
  Game.startGame(req.params.id)
    .then((game) => {
      res.json(game);
    })
    .catch((err) => {
      next(err);
    });
});

export default router;
