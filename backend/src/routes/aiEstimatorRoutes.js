// Purpose: Express Router for AI Estimator endpoints
// Path: backend/src/routes/aiEstimatorRoutes.js

const express = require('express');
const { calculateAiEstimate } = require('../controllers/AiEstimatorController');

const router = express.Router();

router.post('/estimate', calculateAiEstimate);

module.exports = router;