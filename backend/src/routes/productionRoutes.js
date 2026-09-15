const express = require('express');
const router = express.Router();

let scanLogs = [];

router.get('/scans', (req, res) => {
  res.status(200).json({ success: true, data: scanLogs });
});

router.post('/scans', (req, res) => {
  const payload = req.body || {};
  const record = {
    id: payload.id || `scan-${Date.now()}`,
    bundleCode: payload.bundleCode || 'BND-000',
    orderNumber: payload.orderNumber || 'JO-000',
    tailorName: payload.tailorName || 'Worker Name',
    operation: payload.operation || 'General Stitching',
    completedPieces: Number(payload.completedPieces || 0),
    rejectedPieces: Number(payload.rejectedPieces || 0),
    pieceValue: Number(payload.pieceValue || 0),
    loggedAt: payload.loggedAt || 'Just now',
    isDeleted: false,
  };

  scanLogs.unshift(record);

  res.status(201).json({
    success: true,
    data: record,
  });
});

router.delete('/scans/:id', (req, res) => {
  const { id } = req.params;
  const index = scanLogs.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Scan not found' });
  }

  scanLogs.splice(index, 1);
  res.status(200).json({ success: true, message: 'Scan deleted successfully' });
});

module.exports = router;
