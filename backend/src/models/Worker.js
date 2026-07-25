// Purpose: Worker HR Profile & Rate Engine Schema
// Path: backend/src/models/Worker.js

const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  contractorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  currentCompanyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  currentWorkshopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workshop',
    required: true,
    index: true
  },
  workerCode: {
    type: String,
    required: true,
    unique: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  paymentType: {
    type: String,
    enum: ['PIECE_RATE', 'DAILY_WAGE', 'MONTHLY_SALARY'],
    default: 'PIECE_RATE'
  },
  baseRatePerPiece: {
    type: Number,
    default: 0
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'TRANSFERRED', 'TERMINATED'],
    default: 'ACTIVE',
    index: true
  },
  transferHistory: [{
    fromCompanyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    toCompanyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    fromWorkshopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workshop' },
    toWorkshopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workshop' },
    transferredAt: { type: Date, default: Date.now },
    reason: String
  }],
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true
});

workerSchema.index({ contractorId: 1, currentWorkshopId: 1, status: 1 });

module.exports = mongoose.model('Worker', workerSchema);