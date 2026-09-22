const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('Missing MONGODB_URI. Add it to your .env file (see .env.example).');
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    throw new Error(`MongoDB connection failed: ${err.message}`);
  }
}

module.exports = connectDB;
