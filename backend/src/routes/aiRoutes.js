// Purpose: Express Router for AI Analytics endpoints
// Path: backend/src/routes/aiRoutes.js

const express = require('express');
const { getAiInsights } = require('../controllers/AiController');
const { authenticate } = require('../middlewares/authenticate');

const router = express.Router();

// Protected AI endpoint
router.get('/insights', authenticate, getAiInsights);

module.exports = router;