// Purpose: Enterprise Database Connection Management & Lifecycle Controls
// Path: backend/config/db.js

const mongoose = require('mongoose');

/**
 * Connects to MongoDB Atlas / Local MongoDB instance with connection pooling
 * and automated reconnect handling.
 */
const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error('FATAL ERROR: MONGODB_URI environment variable is missing.');
    process.exit(1);
  }

  const options = {
    maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE, 10) || 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    autoIndex: process.env.NODE_ENV !== 'production', // Disable auto-indexing in production for performance
  };

  try {
    const conn = await mongoose.connect(mongoURI, options);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] Initial Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

// Lifecycle Listener: Disconnection Handling
mongoose.connection.on('disconnected', () => {
  console.warn('[Database Alert] Mongoose connection lost. Attempting reconnect...');
});

// Lifecycle Listener: Error Handling
mongoose.connection.on('error', (err) => {
  console.error(`[Database Error] Mongoose runtime error: ${err.message}`);
});

// Graceful Shutdown Handler for SIGINT / SIGTERM signals
const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('[Database] Mongoose connection closed gracefully.');
  } catch (error) {
    console.error(`[Database Error] Error during connection closure: ${error.message}`);
  }
};

module.exports = { connectDB, closeDB };