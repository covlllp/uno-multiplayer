import chalk from 'chalk';
import http from 'http';

import startDbPromise from './db';
import setUpSockets from './socket';

const server = http.createServer();
console.log('start');

const createApplication = new Promise((resolve) => {
  server.on('request', require('./app'));

  // set up sockets
  setUpSockets(server);
  console.log('serverStart');
  resolve();
});

function startServer() {
  console.log('server starting');
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(chalk.blue('Server started on port', chalk.magenta(PORT)));
  });
}

startDbPromise
  .then(createApplication)
  .then(startServer)
  .catch((err) => {
    console.error('Initialization error: ', chalk.red(err.message));
  });
