// Purpose: Multi-Company Tenant Container Schema
// Path: backend/src/models/Company.js

const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  contractorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  companyCode: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  gstin: {
    type: String,
    trim: true,
    uppercase: true
  },
  companyType: {
    type: String,
    enum: ['Private Limited', 'Proprietorship', 'Partnership', 'LLP', 'Other'],
    default: 'Proprietorship'
  },
  primaryContactPhone: {
    type: String,
    required: true
  },
  primaryContactEmail: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },
  deletedAt: { type: Date, default: null }
}, {
  timestamps: true
});

companySchema.index({ contractorId: 1, companyName: 1 }, { unique: true });

module.exports = mongoose.model('Company', companySchema);