// Purpose: Unit Tests for Authentication Service (Repository Mocked)
// Path: backend/tests/unit/authService.test.js

const authService = require('../../src/services/AuthService');
const UserRepository = require('../../src/repositories/UserRepository');
const AuditLogRepository = require('../../src/repositories/AuditLogRepository');

// Mock the Repositories
jest.mock('../../src/repositories/UserRepository');
jest.mock('../../src/repositories/AuditLogRepository');

describe('AuthService - Unit Tests', () => {
  const mockUserId = '60d5ecb8b5c9c22b1c8e4567';

  const mockUserData = {
    _id: mockUserId,
    name: 'John Contractor',
    email: 'contractor@example.com',
    role: 'CONTRACTOR',
    phone: '+1234567890',
    isActive: true,
    isDeleted: false,
    tokenVersion: 0,
    comparePassword: jest.fn(),
    toObject: function () {
      const copy = { ...this };
      delete copy.comparePassword;
      delete copy.toObject;
      return copy;
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Default audit log mock implementation to resolve cleanly
    AuditLogRepository.logEvent.mockResolvedValue(true);
    UserRepository.updateLastLogin.mockResolvedValue(true);
  });

  describe('register()', () => {
    it('should successfully register a new user with hashed password', async () => {
      UserRepository.findByEmail.mockResolvedValue(null);
      UserRepository.create.mockResolvedValue(mockUserData);

      const user = await authService.register({
        name: 'John Contractor',
        email: 'contractor@example.com',
        password: 'SecurePassword123!',
        role: 'CONTRACTOR',
        phone: '+1234567890'
      });

      expect(user).toBeDefined();
      expect(user.email).toBe(mockUserData.email.toLowerCase());
      expect(UserRepository.create).toHaveBeenCalledTimes(1);
      expect(AuditLogRepository.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'USER_REGISTERED' })
      );
    });

    it('should throw an error if registering with an existing email', async () => {
      UserRepository.findByEmail.mockResolvedValue(mockUserData);

      await expect(
        authService.register({
          email: 'contractor@example.com',
          password: 'SecurePassword123!'
        })
      ).rejects.toThrow('User with this email already exists');
    });
  });

  describe('login()', () => {
    it('should authenticate valid credentials and return user with token', async () => {
      const userInstance = { ...mockUserData };
      userInstance.comparePassword.mockResolvedValue(true);
      UserRepository.findByEmailWithPassword.mockResolvedValue(userInstance);

      const result = await authService.login(
        'contractor@example.com',
        'SecurePassword123!'
      );

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe(mockUserData.email);
      expect(typeof result.accessToken).toBe('string');
      expect(AuditLogRepository.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'LOGIN_SUCCESS' })
      );
    });

    it('should throw an error for non-existent email', async () => {
      UserRepository.findByEmailWithPassword.mockResolvedValue(null);

      await expect(
        authService.login('nonexistent@example.com', 'Password123!')
      ).rejects.toThrow('Invalid email or password');
    });

    it('should throw an error for incorrect password', async () => {
      const userInstance = { ...mockUserData };
      userInstance.comparePassword.mockResolvedValue(false);
      UserRepository.findByEmailWithPassword.mockResolvedValue(userInstance);

      await expect(
        authService.login('contractor@example.com', 'WrongPassword123!')
      ).rejects.toThrow('Invalid email or password');

      expect(AuditLogRepository.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'LOGIN_FAILED' })
      );
    });
  });

  describe('verifyToken()', () => {
    it('should verify valid JWT token and return user payload', async () => {
      const userInstance = { ...mockUserData };
      userInstance.comparePassword.mockResolvedValue(true);
      UserRepository.findByEmailWithPassword.mockResolvedValue(userInstance);

      const { accessToken } = await authService.login(
        'contractor@example.com',
        'SecurePassword123!'
      );

      const decoded = await authService.verifyToken(accessToken);

      expect(decoded).toBeDefined();
      expect(decoded.sub || decoded.id).toBe(mockUserId);
    });

    it('should throw an error for an invalid JWT token', async () => {
      await expect(
        authService.verifyToken('invalid.jwt.token')
      ).rejects.toThrow();
    });
  });
});