import express from 'express';

import configureMiddleware from './middleware/configure';
import configureRoutes from './routes/configure';

const app = express();
console.log('app created');

// configureMiddleware(app);
// configureRoutes(app);

app.use('*', (req, res) => {
  res.json({
    hello: 'world',
  });
});

export default app;
