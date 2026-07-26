// Purpose: Attendance Model
// Path: backend/src/models/Attendance.js

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ['Present', 'Absent', 'Half Day', 'Leave'],
      required: true,
      default: 'Present',
    },

    checkIn: {
      type: String,
      default: '',
    },

    checkOut: {
      type: String,
      default: '',
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

// Prevent duplicate attendance records for the same worker on the same date
attendanceSchema.index({ worker: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);