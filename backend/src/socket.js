// Purpose: Real-time WebSockets Engine, JWT Handshake Auth & Multi-tenant Room Subscriptions
// Path: backend/src/socket.js

const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('./config/environment');

let io = null;

/**
 * Initializes Socket.io server with authentication handshake and room join logic
 * @param {Object} server - Native Node HTTP server instance
 * @returns {Object} Socket.io server instance
 */
const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: config.cors.origin || '*',
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // Authentication Handshake Middleware for WebSockets
  io.use((socket, next) => {
    try {
      const authHeader = socket.handshake.headers?.authorization;
      const token =
        socket.handshake.auth?.token ||
        (authHeader && authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null);

      if (!token) {
        return next(new Error('Authentication error: Missing JWT token'));
      }

      // Verify JWT token payload
      const decoded = jwt.verify(token, config.jwt.secret);
      socket.user = decoded; // Attach decoded user identity to socket instance
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid or expired token'));
    }
  });

  // Client Connection Handler
  io.on('connection', (socket) => {
    const { id: userId, tenantId, role } = socket.user;
    console.log(`[Socket.io] Client Connected: ${socket.id} (User: ${userId}, Role: ${role})`);

    // Auto-join personal user room for targeted notifications
    if (userId) {
      socket.join(`user:${userId}`);
    }

    // Auto-join contractor tenant room for company-wide updates
    if (tenantId) {
      socket.join(`contractor:${tenantId}`);
    }

    // Explicit room subscription event (e.g. joining specific workshop channel)
    socket.on('join_workshop', (workshopId) => {
      if (workshopId) {
        socket.join(`workshop:${workshopId}`);
        console.log(`[Socket.io] Socket ${socket.id} joined workshop:${workshopId}`);
      }
    });

    // Explicit room leave event
    socket.on('leave_workshop', (workshopId) => {
      if (workshopId) {
        socket.leave(`workshop:${workshopId}`);
        console.log(`[Socket.io] Socket ${socket.id} left workshop:${workshopId}`);
      }
    });

    // Handle Client Disconnect
    socket.on('disconnect', (reason) => {
      console.log(`[Socket.io] Client Disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
};

/**
 * Returns the active Socket.io instance
 * @returns {Object} Socket.io server instance
 */
const getIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized. Call initSocket(server) first.');
  }
  return io;
};

/**
 * Helper to emit a real-time event to a specific room channel
 * @param {string} room - Room ID (e.g. 'contractor:123', 'user:456')
 * @param {string} event - Event key name
 * @param {Object} data - Event payload body
 */
const emitToRoom = (room, event, data) => {
  if (io) {
    io.to(room).emit(event, data);
  }
};

module.exports = {
  initSocket,
  getIO,
  emitToRoom
};