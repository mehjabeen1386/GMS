/**
 * Purpose: HTTP Server Execution, Database Connection & Graceful Shutdown Setup
 * Path: backend/src/server.js
 */

const http = require('http');
const app = require('./app');
const config = require('./config/environment');
const connectDB = require('./config/database');
const { initSocket } = require('./socket');

// Handle Uncaught Synchronous Exceptions Globally
process.on('uncaughtException', (err) => {
  console.error('FATAL: UNCAUGHT EXCEPTION! Shutting down server...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

// Create Native HTTP Server Wrapping Express App
const server = http.createServer(app);

// Initialize Socket.io WebSockets Instance
initSocket(server);

// Start Database Connection and Start Listening
const startServer = async () => {
  try {
    // Connect to MongoDB Database
    await connectDB();

    const PORT = config.port || 5000;
    server.listen(PORT, () => {
      console.log('=======================================================');
      console.log('            GARMENT BACKEND API ENGINE ACTIVE          ');
      console.log(` Environment : ${config.env.toUpperCase()}`);
      console.log(` Server Port : ${PORT}`);
      console.log(` Base URL    : http://localhost:${PORT}/api/v1`);
      console.log(` Health Check: http://localhost:${PORT}/health`);
      console.log('=======================================================');
    });
  } catch (error) {
    console.error('FAILED TO START SERVER:', error.message);
    process.exit(1);
  }
};

startServer();

// Handle Unhandled Asynchronous Promise Rejections
process.on('unhandledRejection', (err) => {
  console.error('FATAL: UNHANDLED PROMISE REJECTION! Terminating server...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM OS Termination Signals (e.g., Docker / Kubernetes / Heroku)
process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Executing graceful server shutdown...');
  server.close(() => {
    console.log('HTTP Server closed successfully.');
    process.exit(0);
  });
});

// Handle SIGINT OS Termination Signals (e.g., Ctrl+C in CLI)
process.on('SIGINT', () => {
  console.log('SIGINT RECEIVED. Executing graceful server shutdown...');
  server.close(() => {
    console.log('HTTP Server closed successfully.');
    process.exit(0);
  });
});