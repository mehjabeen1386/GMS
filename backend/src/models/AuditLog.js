// Purpose: Immutable Security Audit Log Schema
// Path: backend/src/models/AuditLog.js

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  actorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  role: {
    type: String,
    required: true
  },
  module: {
    type: String,
    enum: ['AUTH', 'COMPANY', 'WORKSHOP', 'WORKER', 'INVENTORY', 'PRODUCTION', 'PAYROLL', 'AI', 'SETTINGS'],
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true // e.g., "CREATE_WORKER", "TRANSFER_WORKER", "PROCESS_SALARY"
  },
  details: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: String,
  previousState: mongoose.Schema.Types.Mixed,
  newState: mongoose.Schema.Types.Mixed
}, {
  timestamps: { createdAt: true, updatedAt: false } // Immutable logs (No updatedAt)
});

auditLogSchema.index({ createdAt: -1, module: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);