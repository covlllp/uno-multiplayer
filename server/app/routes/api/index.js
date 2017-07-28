import express from 'express';

import gameRouter from './game';
import playerRouter from './player';

const router = express.Router();

export default router;

// add routes here
router.use('/game', gameRouter);
router.use('/player', playerRouter);

// error handling
router.use((req, res) => {
  res.status(404).end();
});
