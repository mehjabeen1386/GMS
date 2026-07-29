// Purpose: Root API Router Aggregator
// Path: backend/src/routes/index.js

const express = require('express');
const router = express.Router();

// Import sub-route modules
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const companyRoutes = require('./companyRoutes');
const workshopRoutes = require('./workshopRoutes');
const workerRoutes = require('./workerRoutes');
const clothRoutes = require('./clothRoutes');
const orderRoutes = require('./orderRoutes');
const assignmentRoutes = require('./assignmentRoutes');
const attendanceRoutes = require('./attendanceRoutes');
const salaryRoutes = require('./salaryRoutes');
const ledgerRoutes = require('./ledgerRoutes');
const machineRoutes = require('./machineRoutes');
const qualityCheckRoutes = require('./qualityCheckRoutes');
const notificationRoutes = require('./notificationRoutes');

/**
 * Health check endpoint for verifying API router status
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Garmora ERP API Gateway active',
    timestamp: new Date().toISOString()
  });
});

// Mount domain routes under API v1 endpoints
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/companies', companyRoutes);
router.use('/workshops', workshopRoutes);
router.use('/workers', workerRoutes);
router.use('/cloths', clothRoutes);
router.use('/orders', orderRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/attendances', attendanceRoutes);
router.use('/salaries', salaryRoutes);
router.use('/ledger', ledgerRoutes);
router.use('/machines', machineRoutes);
router.use('/quality-checks', qualityCheckRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;