'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var schema = new Schema({
  name: { type: String },
  isReady: { type: Boolean, default: false },
  cards: [{ type: ObjectId, ref: 'Card' }],
});

mongoose.model('Player', schema);
