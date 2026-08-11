// Purpose: Core Authentication & Role Management Schema
// Path: backend/src/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: ['SUPER_ADMIN', 'CONTRACTOR', 'WORKSHOP_MANAGER', 'WORKER'],
    default: 'WORKER',
    required: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  preferredLanguage: {
    type: String,
    enum: ['en', 'hi'],
    default: 'en'
  },
  isTwoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: {
    type: String,
    select: false
  },
  refreshTokens: [{
    token: { type: String, select: false },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    ipAddress: String,
    userAgent: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

userSchema.index({ username: 1, role: 1 });
userSchema.index({ email: 1, isDeleted: 1 });

// Automatically hash password before saving ONLY if modified and NOT already hashed
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  // Prevent double-hashing if password was pre-hashed by repository/service
  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method attached to Mongoose Document instance
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);