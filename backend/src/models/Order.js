// Purpose: Garment Production Job Order Data Model
// Path: backend/src/models/Order.js

const mongoose = require('mongoose');

const operationSchema = new mongoose.Schema({
  name: String,
  sequenceOrder: Number,
  pieceRate: Number,
  completedPieces: { type: Number, default: 0 },
});

const orderSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: false, // Optional to prevent blocking custom modal creation payloads
    },
    workshopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workshop',
      required: false,
    },
    contractorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    clothId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cloth',
      required: false,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    styleName: {
      type: String,
      required: true,
      default: 'Garment Item',
    },
    clientName: {
      type: String,
      required: true,
      default: 'N/A',
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    completedQuantity: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
    },
    fabricDetails: {
      type: { type: String, default: 'Standard Fabric' },
      consumptionPerPieceMeters: { type: Number, default: 1.5 },
      totalRequiredMeters: { type: Number, default: 0 },
    },
    operations: [operationSchema],
    bundles: [],
    dueDate: {
      type: Date,
    },
    startDate: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);