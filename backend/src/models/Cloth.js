// Purpose: Raw Fabric Stock Ledger & Loss Calculator Schema
// Path: backend/src/models/Cloth.js

const mongoose = require('mongoose');

const clothSchema = new mongoose.Schema({
  contractorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  clothName: {
    type: String,
    required: true // e.g., "Cotton - 80 GSM", "Linen - 100 GSM"
  },
  supplierName: String,
  totalQuantityPcs: {
    type: Number,
    required: true,
    min: 0
  },
  remainingQuantityPcs: {
    type: Number,
    required: true,
    min: 0
  },
  piecesMade: {
    type: Number,
    default: 0
  },
  ratePerShirt: {
    type: Number,
    required: true
  },
  bringingDate: {
    type: Date,
    required: true
  },
  sendingDate: Date,
  status: {
    type: String,
    enum: ['IN_STOCK', 'IN_PRODUCTION', 'COMPLETED', 'EXHAUSTED'],
    default: 'IN_STOCK'
  },
  isDeleted: { type: Boolean, default: false, index: true }
}, {
  timestamps: true
});

clothSchema.index({ companyId: 1, clothName: 1, status: 1 });

module.exports = mongoose.model('Cloth', clothSchema);