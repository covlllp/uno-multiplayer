'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var colors = [
  'red',
  'yellow',
  'green',
  'blue',
  'wild'
];

var cardValues = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'skip',
  'reverse',
  'draw',
];

var schema = Schema({
  color: { type: String, enum: colors },
  value: { type: String, enum: cardValues },
  penalty: { type: Number },
  game: { type: ObjectId, ref: 'Game' }
});

mongoose.model('Card', schema);
