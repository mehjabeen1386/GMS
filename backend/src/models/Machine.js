// Purpose: Machine Model
// Path: backend/src/models/Machine.js

const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema(
  {
    machineName: {
      type: String,
      required: true,
      trim: true,
    },

    machineCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    machineType: {
      type: String,
      enum: [
        'Sewing Machine',
        'Overlock Machine',
        'Cutting Machine',
        'Button Machine',
        'Iron Press',
        'Embroidery Machine',
        'Other',
      ],
      required: true,
    },

    status: {
      type: String,
      enum: [
        'Available',
        'In Use',
        'Under Maintenance',
        'Out of Service',
      ],
      default: 'Available',
    },

    purchaseDate: {
      type: Date,
    },

    assignedWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      default: null,
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

module.exports = mongoose.model('Machine', machineSchema);