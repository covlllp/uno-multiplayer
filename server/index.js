import chalk from 'chalk';
import express from 'express';
import http from 'http';

import startDbPromise from './db';
import configureApp from './app';
import setUpSockets from './socket';

const app = express();
app.server = http.createServer(app);

const configureApplication = new Promise((resolve) => {
  configureApp(app);
  setUpSockets(app.server);
  resolve();
}).catch((err) => {
  console.error('Application config error: ', chalk.red(err));
});

function startServer() {
  const PORT = process.env.PORT || 3000;
  app.server.listen(PORT, () => {
    console.log(chalk.blue('Server started on port', chalk.magenta(PORT)));
  });
}

startDbPromise
  .then(configureApplication)
  .then(startServer)
  .catch((err) => {
    console.error('Initialization error: ', chalk.red(err.message));
  });
