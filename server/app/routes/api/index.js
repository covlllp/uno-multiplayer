'use strict';

var router = require('express').Router();
module.exports = router;

// add routes here
router.use('/game', require('./game'));
router.use('/player', require('./player'));

// error handling
router.use(function(req, res) {
  res.status(404).end();
})
