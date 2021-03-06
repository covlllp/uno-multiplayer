import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();
const Player = mongoose.model('Player');

router.post('/', (req, res, next) => {
  Player.create({}).then((player) => {
    res.json(player);
  }).catch((err) => {
    next(err);
  });
});

router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { body } = req;
  Player.findByIdAndUpdate(id, body, { new: true }).then((player) => {
    res.json(player);
  }).catch((err) => {
    next(err);
  });
});

export default router;
