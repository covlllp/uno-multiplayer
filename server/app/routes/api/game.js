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
  const {
    playerId,
    cardId,
  } = req.body;
  Game.playCardByPlayer(req.params.id, { playerId, cardId })
    .then((game) => {
      res.json(game);
    })
    .catch((err) => {
      next(err);
    });
});

router.put('/drawCards/:id', (req, res, next) => {
  const {
    playerId,
    amount,
    playAsTurn,
  } = req.body;
  Game.drawCardsByPlayer(req.params.id, { playerId, amount, playAsTurn })
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
