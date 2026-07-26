// Purpose: Ledger Model
// Path: backend/src/models/Ledger.js

const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema(
  {
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null,
    },

    transactionType: {
      type: String,
      enum: ['Credit', 'Debit'],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    transactionDate: {
      type: Date,
      default: Date.now,
    },

    description: {
      type: String,
      trim: true,
      default: '',
    },

    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Ledger', ledgerSchema);