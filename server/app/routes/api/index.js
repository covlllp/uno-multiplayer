import express from 'express';

const router = express.Router();

export default router;

console.log('api routes set up');

// add routes here
router.use('/game', require('./game'));
router.use('/player', require('./player'));

// error handling
router.use((req, res) => {
  res.status(404).end();
});
