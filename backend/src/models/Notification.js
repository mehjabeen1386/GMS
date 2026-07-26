// Purpose: Notification Model
// Path: backend/src/models/Notification.js

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        'Info',
        'Success',
        'Warning',
        'Error',
        'Order',
        'Assignment',
        'Payment',
        'Attendance',
      ],
      default: 'Info',
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    relatedEntity: {
      type: String,
      enum: [
        'Order',
        'Worker',
        'Assignment',
        'Attendance',
        'Payment',
        'Ledger',
        'Machine',
        'QualityCheck',
        'None',
      ],
      default: 'None',
    },

    relatedEntityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', notificationSchema);