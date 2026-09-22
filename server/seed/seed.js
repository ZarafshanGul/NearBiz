require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Business = require('../models/Business');
const sampleBusinesses = require('./data');

async function seed() {
  await connectDB();
  let exitCode = 0;

  try {
    const existingCount = await Business.countDocuments();

    if (existingCount > 0) {
      console.log(`Database already has ${existingCount} business(es).`);
      console.log('Skipping seed to avoid duplicates. Delete the collection first if you want to reseed.');
    } else {
      const inserted = await Business.insertMany(sampleBusinesses);
      console.log(`Seeded ${inserted.length} sample businesses.`);
    }
  } catch (err) {
    console.error('Seed failed:', err);
    exitCode = 1;
  } finally {
    await mongoose.connection.close();
    process.exit(exitCode);
  }
}

seed();
