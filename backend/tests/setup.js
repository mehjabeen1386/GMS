// Purpose: Jest Global Environment Setup, In-Memory MongoDB Lifecycle & JWT Utilities
// Path: backend/tests/setup.js
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose'); const jwt = require('jsonwebtoken');
const config = require('../src/config/environment'); let mongoServer;
// Increase timeout for in-memory MongoDB download & startup jest.setTimeout(30000);
/**
*	Global BeforeAll Hook: Initialize In-Memory MongoDB Server & Mongoose Connection
 */
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();   const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,     useUnifiedTopology: true
  });
});
/**
*	Global BeforeEach Hook: Clear all collection data to guarantee test isolation
 */
beforeEach(async () => {
  if (mongoose.connection.readyState === 1) {     const collections = mongoose.connection.collections;
    for (const key in collections) {       await collections[key].deleteMany({});
    }
  }
});
/**
*	Global AfterAll Hook: Close Mongoose Connection & Stop Mongo Memory Server
 */
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {     await mongoServer.stop();
  }
});
/**
*	Helper Utility: Generates a signed test JWT authentication token
*	@param {Object} payload - User token payload options
*	@returns {string} Signed JWT Bearer Token
 */
global.generateTestToken = (payload = {}) => {
  const defaultPayload = {
    id: new mongoose.Types.ObjectId().toString(),
    email: 'testuser@example.com',
    role: 'CONTRACTOR',
    tenantId: new mongoose.Types.ObjectId().toString(),
    ...payload
  };
  return jwt.sign(defaultPayload, config.jwt.secret || 'test_jwt_secret', {
    expiresIn: config.jwt.expiresIn || '1d'
  });
};
/**
*	Helper Utility: Creates a standard dummy ObjectId string
*	@returns {string} Valid Mongoose ObjectId String
 */
global.generateObjectId = () => {
  return new mongoose.Types.ObjectId().toString(); };
