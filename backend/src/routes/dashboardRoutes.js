// Purpose: Routes for dashboard summary metrics
// Path: backend/src/routes/dashboardRoutes.js

const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Worker = require('../models/Worker');
const authenticate = require('../middlewares/authenticate');

router.use(authenticate);

const getDashboardSummary = async (contractorId) => {
  const summary = {
    activeOrdersCount: 0,
    factoryWorkforce: 0,
    fabricInStock: 0,
    pendingPayouts: 0,
    updatedAt: new Date().toISOString(),
  };

  try {
    summary.activeOrdersCount = await Order.countDocuments({
      contractorId,
      isDeleted: { $ne: true },
      status: { $nin: ['COMPLETED', 'CANCELLED'] },
    });
  } catch (error) {
    summary.activeOrdersCount = 0;
  }

  try {
    summary.factoryWorkforce = await Worker.countDocuments({
      isDeleted: { $ne: true },
      status: { $ne: 'INACTIVE' },
    });
  } catch (error) {
    summary.factoryWorkforce = 0;
  }

  return summary;
};

router.get('/summary', async (req, res) => {
  const contractorId = req.user?._id || req.user?.id || req.user?.contractorId;
  const summary = await getDashboardSummary(contractorId);
  res.status(200).json({ success: true, data: summary });
});

router.post('/refresh', async (req, res) => {
  const contractorId = req.user?._id || req.user?.id || req.user?.contractorId;
  const summary = await getDashboardSummary(contractorId);
  res.status(200).json({ success: true, data: summary });
});

router.put('/summary', async (req, res) => {
  const contractorId = req.user?._id || req.user?.id || req.user?.contractorId;
  const summary = await getDashboardSummary(contractorId);
  res.status(200).json({ success: true, data: summary });
});

module.exports = router;