// Purpose: Workshop (Karkhana) Physical Unit Management Schema
// Path: backend/src/models/Workshop.js

const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  contractorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  workshopName: {
    type: String,
    required: true,
    trim: true
  },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  address: String,
  totalMachines: {
    type: Number,
    default: 0
  },
  totalCapacity: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true
});

workshopSchema.index({ companyId: 1, workshopName: 1 });

module.exports = mongoose.model('Workshop', workshopSchema);