import express from 'express';
import path from 'path';

const rootPath = path.join(__dirname, '..', '..', '..');
const srcPath = path.join(rootPath, 'src');

export default function setRoutes(app) {
  console.log('setting up routes');
  // Serve static images
  app.use('/css', express.static(path.join(srcPath, 'css')));

  // Serve api routes
  app.use('/api', require('./api'));

  // Otherwise serve main HTML page
  app.get('*', (req, res) => {
    console.log('route working');
    res.sendFile(path.join(srcPath, 'index.html'));
  });

  // Error handling
  app.use((err, res) => {
    res.status(err.status).send(err.message);
  });
}
