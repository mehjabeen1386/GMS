/**
 * Purpose: Immutable Security Audit Log Schema
 * Path: backend/src/models/AuditLog.js
 */

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    action: { 
      type: String, 
      required: true 
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    actorId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    module: { 
      type: String, 
      enum: ['AUTH', 'COMPANY', 'WORKSHOP', 'WORKER', 'INVENTORY', 'PRODUCTION', 'PAYROLL', 'AI', 'SETTINGS'],
      default: 'AUTH',
      required: false,
      index: true 
    },
    role: { 
      type: String, 
      required: false 
    },
    details: { 
      type: mongoose.Schema.Types.Mixed 
    },
    ip: { 
      type: String 
    },
    ipAddress: { 
      type: String 
    },
    userAgent: { 
      type: String 
    },
    previousState: mongoose.Schema.Types.Mixed,
    newState: mongoose.Schema.Types.Mixed
  },
  { 
    timestamps: { createdAt: true, updatedAt: false } 
  }
);

auditLogSchema.index({ createdAt: -1, module: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);