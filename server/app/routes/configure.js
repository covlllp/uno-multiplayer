'use strict';

var path = require('path');
var express = require('express');

var rootPath = path.join(__dirname, '..', '..', '..');
var srcPath = path.join(rootPath, 'src');

module.exports = function setRoutes(app) {
  // Serve static images
  app.use('/css', express.static(path.join(srcPath, 'css')));

  // Serve api routes
  app.use('/api', require('./api'));

  // Otherwise serve main HTML page
  app.get('*', function(req, res) {
    res.sendFile(path.join(srcPath, 'index.html'));
  });

  // Error handling
  app.use(function(err, req, res) {
    res.status(err.status).send(err.message);
  });
}
