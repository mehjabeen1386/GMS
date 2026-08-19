// Purpose: Express Router for AI Analytics endpoints
// Path: backend/src/routes/aiRoutes.js

const express = require('express');
const { getAiInsights } = require('../controllers/AiController');

// Agar authenticate middleware direct function export karta hai (module.exports = authenticate),
// toh curly braces {} mat lagayein:
const authenticate = require('../middlewares/authenticate'); 

const router = express.Router();

// Route define karein
router.get('/insights', authenticate, getAiInsights);

module.exports = router;