const express = require('express');
const router = express.Router();

let buyersStore = [];

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    data: buyersStore,
  });
});

router.post('/', (req, res) => {
  const payload = req.body || {};
  const newBuyer = {
    id: payload.id || `buyer-${Date.now()}`,
    brand: payload.brand || 'New Buyer',
    gst: payload.gst || 'NA',
    contactPerson: payload.contactPerson || 'Not specified',
    phone: payload.phone || '',
    email: payload.email || '',
    status: payload.status || 'ACTIVE',
    totalOrders: Number(payload.totalOrders || 0),
    outstandingBal: payload.outstandingBal || 'Settled (₹0)',
  };

  buyersStore = [newBuyer, ...buyersStore];

  res.status(201).json({
    success: true,
    data: newBuyer,
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const payload = req.body || {};

  buyersStore = buyersStore.map((buyer) =>
    buyer.id === id
      ? {
          ...buyer,
          ...payload,
          totalOrders: Number(payload.totalOrders ?? buyer.totalOrders),
        }
      : buyer
  );

  const updated = buyersStore.find((buyer) => buyer.id === id);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Buyer not found' });
  }

  res.status(200).json({
    success: true,
    data: updated,
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const exists = buyersStore.some((buyer) => buyer.id === id);
  if (!exists) {
    return res.status(404).json({ success: false, message: 'Buyer not found' });
  }

  buyersStore = buyersStore.filter((buyer) => buyer.id !== id);
  res.status(200).json({
    success: true,
    message: 'Buyer deleted successfully',
  });
});

module.exports = router;
