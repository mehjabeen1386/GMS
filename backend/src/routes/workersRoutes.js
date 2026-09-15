const express = require('express');
const router = express.Router();

let workersStore = [];

router.get('/', (req, res) => {
  res.status(200).json({ success: true, data: workersStore });
});

router.post('/', (req, res) => {
  const payload = req.body || {};
  const worker = {
    id: payload.id || `worker-${Date.now()}`,
    name: payload.name || 'New Worker',
    skill: payload.skill || 'Tailor',
    phone: payload.phone || '',
    joined: payload.joined || new Date().toISOString().split('T')[0],
    lifetimeOutput: payload.lifetimeOutput || '0 pcs',
    unpaidBalance: payload.unpaidBalance || '₹0',
    status: payload.status || 'ACTIVE',
  };

  workersStore = [worker, ...workersStore];
  res.status(201).json({ success: true, data: worker });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const exists = workersStore.some((worker) => worker.id === id || worker.phone === id);
  if (!exists) {
    return res.status(404).json({ success: false, message: 'Worker not found' });
  }

  workersStore = workersStore.filter((worker) => worker.id !== id && worker.phone !== id);
  res.status(200).json({ success: true, message: 'Worker deleted successfully' });
});

module.exports = router;
