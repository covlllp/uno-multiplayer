import chalk from 'chalk';
import mongoose from 'mongoose';

import ENV from './../env';

mongoose.Promise = global.Promise;

const DATABASE_URI = ENV.DATABASE_URI;
const db = mongoose.connect(DATABASE_URI, { useMongoClient: true });

// Require the models
require('./models/card');
require('./models/player');
require('./models/game');

// Just return a simple promise!
const startDbPromise = new Promise((resolve, reject) => {
  db.on('open', resolve);
  db.on('error', reject);
});

console.log(chalk.yellow('Opening connection to MongoDB...'));
startDbPromise.then(() => {
  console.log(chalk.green('MongoDB connection opened!'));
});

export default startDbPromise;
