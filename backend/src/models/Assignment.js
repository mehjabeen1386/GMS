// Purpose: Assignment Model
// Path: backend/src/models/Assignment.js

const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },

    assignedQuantity: {
      type: Number,
      required: true,
      min: 1,
    },

    completedQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        'Pending',
        'In Progress',
        'Completed',
        'Cancelled',
      ],
      default: 'Pending',
    },

    assignedDate: {
      type: Date,
      default: Date.now,
    },

    dueDate: {
      type: Date,
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

module.exports = mongoose.model('Assignment', assignmentSchema);