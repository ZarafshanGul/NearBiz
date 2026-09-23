const path = require('path');
require('dotenv').config({ path: process.env.DOTENV_CONFIG_PATH || path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const businessRoutes = require('./routes/businesses');

const app = express();
let databasePromise;

const allowedOrigin = process.env.CLIENT_ORIGIN && process.env.CLIENT_ORIGIN !== '*'
  ? process.env.CLIENT_ORIGIN
  : true;

app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: '50kb' }));

app.get('/', (req, res) => {
  res.json({
    name: 'Local Business Directory API',
    status: 'ok',
    endpoints: [
      'GET  /api/businesses',
      'GET  /api/businesses/stats',
      'POST /api/businesses'
    ]
  });
});

app.use('/api/businesses', async (req, res, next) => {
  try {
    databasePromise ||= connectDB();
    await databasePromise;
    next();
  } catch (error) {
    databasePromise = null;
    next(error);
  }
}, businessRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  res.status(503).json({
    error: 'The directory database is unavailable.',
    details: process.env.NODE_ENV === 'production'
      ? err.message
      : err.message
  });
});

module.exports = app;