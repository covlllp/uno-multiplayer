'use strict';

var express = require('express');
var app = express();
module.exports = app;

require('./middleware/configure')(app);
require('./routes/configure')(app);
