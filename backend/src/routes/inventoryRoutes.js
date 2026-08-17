// Purpose: Inventory & Fabric Rolls Routes (CRUD + Soft Delete & Restore)
// Path: backend/src/routes/inventoryRoutes.js

const express = require('express');
const router = express.Router();

// Temporary In-Memory Database array (Aap ise apne Mongoose/Sequelize Model se replace kar sakte hain)
let fabricRollsStore = [
  {
    id: 'rol-101',
    rollNumber: 'ROL-2026-111',
    fabricName: 'Arabian Wool',
    shadeLot: 'LOT-GREEN-72',
    supplierName: 'Ali Textiles',
    totalMeters: 786,
    remainingMeters: 786,
    status: 'IN_STOCK',
    receivedDate: '2026-08-17',
    isDeleted: false
  },
  {
    id: 'rol-102',
    rollNumber: 'ROL-2026-786',
    fabricName: 'Egyptian Cotton',
    shadeLot: 'LOT-RED-72',
    supplierName: 'Mohammad Textiles',
    totalMeters: 313,
    remainingMeters: 313,
    status: 'IN_STOCK',
    receivedDate: '2026-08-17',
    isDeleted: false
  }
];

// 1. Get All Inventory Rolls
router.get('/rolls', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: fabricRollsStore
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Create a New Fabric Roll
router.post('/rolls', async (req, res) => {
  try {
    const newRoll = {
      id: `rol-${Date.now()}`,
      rollNumber: req.body.rollNumber,
      fabricName: req.body.fabricName,
      shadeLot: req.body.shadeLot,
      supplierName: req.body.supplierName,
      totalMeters: Number(req.body.totalMeters),
      remainingMeters: Number(req.body.remainingMeters || req.body.totalMeters),
      status: req.body.status || 'IN_STOCK',
      receivedDate: req.body.receivedDate ? req.body.receivedDate.split('T')[0] : new Date().toISOString().split('T')[0],
      isDeleted: false
    };

    fabricRollsStore.unshift(newRoll);

    res.status(201).json({
      success: true,
      data: newRoll
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. Soft Delete Fabric Roll (Move to Trash)
router.delete('/rolls/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const roll = fabricRollsStore.find(r => r.id === id);
    
    if (!roll) {
      return res.status(404).json({ success: false, message: 'Fabric roll not found' });
    }

    roll.isDeleted = true;

    res.status(200).json({
      success: true,
      message: 'Fabric roll moved to trash successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. Restore Fabric Roll from Trash
router.patch('/rolls/:id/restore', async (req, res) => {
  try {
    const { id } = req.params;
    const roll = fabricRollsStore.find(r => r.id === id);

    if (!roll) {
      return res.status(404).json({ success: false, message: 'Fabric roll not found' });
    }

    roll.isDeleted = false;

    res.status(200).json({
      success: true,
      message: 'Fabric roll restored successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;