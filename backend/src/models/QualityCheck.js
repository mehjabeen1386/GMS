// Purpose: Quality Check Model
// Path: backend/src/models/QualityCheck.js

const mongoose = require('mongoose');

const qualityCheckSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },

    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      required: true,
    },

    checkedBy: {
      type: String,
      required: true,
      trim: true,
    },

    totalChecked: {
      type: Number,
      required: true,
      min: 1,
    },

    passedQuantity: {
      type: Number,
      required: true,
      min: 0,
    },

    failedQuantity: {
      type: Number,
      required: true,
      min: 0,
    },

    defectType: {
      type: String,
      trim: true,
      default: '',
    },

    status: {
      type: String,
      enum: ['Pending', 'Passed', 'Failed', 'Rework Required'],
      default: 'Pending',
    },

    checkedDate: {
      type: Date,
      default: Date.now,
    },

    remarks: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('QualityCheck', qualityCheckSchema);