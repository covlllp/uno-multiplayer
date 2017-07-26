'use strict';

var router = require('express').Router();
module.exports = router;

// add routes here
router.use('/game', require('./game'));

// error handling
router.use(function(req, res) {
  res.status(404).end();
})
