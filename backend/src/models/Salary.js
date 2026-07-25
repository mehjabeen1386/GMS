// Purpose: Payroll Settlement, Advance Recovery & Payment Status Schema
// Path: backend/src/models/Salary.js

const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  contractorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true,
    index: true
  },
  periodStartDate: {
    type: Date,
    required: true
  },
  periodEndDate: {
    type: Date,
    required: true
  },
  totalShirtsProduced: {
    type: Number,
    default: 0
  },
  grossEarnings: {
    type: Number,
    required: true
  },
  bonusAmount: {
    type: Number,
    default: 0
  },
  advanceDeduction: {
    type: Number,
    default: 0
  },
  netPayable: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['UNPAID', 'PARTIAL', 'PAID'],
    default: 'UNPAID',
    index: true
  },
  paymentMode: {
    type: String,
    enum: ['CASH', 'UPI', 'BANK_TRANSFER'],
    default: 'CASH'
  },
  transactionReference: String,
  paymentDate: Date,
  isDeleted: { type: Boolean, default: false, index: true }
}, {
  timestamps: true
});

salarySchema.index({ workerId: 1, periodStartDate: 1, periodEndDate: 1 }, { unique: true });

module.exports = mongoose.model('Salary', salarySchema);