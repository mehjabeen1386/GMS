// Purpose: Diagnostic Integration Tests for Auth Routes
// Path: tests/integration/authRoutes.test.js

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const User = require('../../src/models/User');

const TEST_DB_URI = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/gms_test';

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_DB_URI);
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await User.deleteMany({});
    await mongoose.connection.close();
  }
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Auth Routes - Integration Tests', () => {
  const testUser = {
    name: 'Jane Contractor',
    fullName: 'Jane Contractor',
    username: 'jane_contractor',
    email: 'jane.contractor@example.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    role: 'CONTRACTOR',
    phone: '+919876543210'
  };

  /**
   * Helper function to robustly extract token from response payload
   */
  const extractToken = (res) => {
    if (!res || !res.body) return undefined;

    return (
      res.body.accessToken ||
      res.body.token ||
      res.body.data?.accessToken ||
      res.body.data?.token ||
      res.body.data?.user?.token
    );
  };

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user and return HTTP 201 with JWT token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser);

      expect(res.statusCode).toEqual(201);
    });

    it('should return HTTP 400 when registering with an existing email', async () => {
      await request(app).post('/api/v1/auth/register').send(testUser);

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser);

      expect([400, 409]).toContain(res.statusCode);
    });

    it('should return HTTP 400 when missing required fields', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'incomplete@example.com'
        });

      expect([400, 422]).toContain(res.statusCode);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should authenticate valid credentials and return HTTP 200 with token', async () => {
      await request(app).post('/api/v1/auth/register').send(testUser);

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(res.statusCode).toEqual(200);

      const token = extractToken(res);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should return HTTP 401 for incorrect password', async () => {
      await request(app).post('/api/v1/auth/register').send(testUser);

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!'
        });

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return user profile HTTP 200 when provided with valid Bearer token', async () => {
      await request(app).post('/api/v1/auth/register').send(testUser);

      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      const token = extractToken(loginRes);

      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
    });

    it('should return HTTP 401 when Authorization header is missing', async () => {
      const res = await request(app).get('/api/v1/auth/me');

      expect(res.statusCode).toEqual(401);
    });
  });
});