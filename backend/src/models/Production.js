// Purpose: High-Velocity Piece Rate Production & Fabric Loss Ledger
// Path: backend/src/models/Production.js

const mongoose = require('mongoose');

const productionSchema = new mongoose.Schema({
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
  workshopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workshop',
    required: true,
    index: true
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true,
    index: true
  },
  clothId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cloth',
    required: true,
    index: true
  },
  productionDate: {
    type: Date,
    required: true,
    index: true
  },
  quantityShirts: {
    type: Number,
    required: true,
    min: 1
  },
  lossPieces: {
    type: Number,
    default: 0,
    min: 0
  },
  ratePerShirt: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  stage: {
    type: String,
    enum: ['CUTTING', 'STITCHING', 'CHECKING', 'PACKING'],
    default: 'STITCHING'
  },
  isDeleted: { type: Boolean, default: false, index: true }
}, {
  timestamps: true
});

// Compound Indexes for fast daily summary generation
productionSchema.index({ workerId: 1, productionDate: -1 });
productionSchema.index({ workshopId: 1, productionDate: -1 });

module.exports = mongoose.model('Production', productionSchema);