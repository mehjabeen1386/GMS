const express = require('express');
const router = express.Router();

const defaultSettings = {
  factoryName: '',
  gstin: '',
  address: '',
  email: '',
  phone: '',
  currency: 'Indian Rupee (INR ₹)',
  whatsappAlerts: true,
  autoScan: true,
};

let settingsStore = { ...defaultSettings };

router.get('/', (req, res) => {
  res.status(200).json({ success: true, data: settingsStore });
});

router.put('/', (req, res) => {
  const payload = req.body || {};
  settingsStore = {
    ...settingsStore,
    ...payload,
  };

  res.status(200).json({ success: true, data: settingsStore });
});

module.exports = router;
