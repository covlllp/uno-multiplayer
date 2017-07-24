'use strict';

var path = require('path');
var express = require('express');

var rootPath = path.join(__dirname, '..', '..', '..');
var srcPath = path.join(rootPath, 'src');

module.exports = function setRoutes(app) {
  // Serve static images
  app.use('/css', express.static(path.join(srcPath, 'css')))

  app.get('/', function(req, res) {
    res.sendFile(path.join(srcPath, 'index.html'));
  });
}
