// Purpose: Backend Controller for AI-powered Garment Operations Insights
// Path: backend/src/controllers/AiController.js

const asyncHandler = require('../middlewares/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

/**
 * @desc    Get AI factory insights and risk predictions
 * @route   GET /api/ai/insights
 * @access  Private
 */
const getAiInsights = asyncHandler(async (req, res) => {
  // Simulated heuristic intelligence for garment operations
  const activeOrders = 12;
  const workforce = 4;
  const fabricStock = 3450;

  let riskLevel = 'LOW';
  let recommendation = 'Operations are running smoothly. Workforce capacity is optimal for current active orders.';
  let efficiencyScore = '94.2%';

  if (activeOrders / workforce > 3) {
    riskLevel = 'HIGH';
    recommendation = 'Warning: High order-to-workforce ratio! Consider assigning 2 more tailors to avoid delivery delays.';
    efficiencyScore = '78.5%';
  } else if (fabricStock < 1000) {
    riskLevel = 'MEDIUM';
    recommendation = 'Caution: Fabric stock is running low. Reorder cotton/blend rolls soon to prevent production halt.';
    efficiencyScore = '85.0%';
  }

  const aiData = {
    riskLevel,
    recommendation,
    efficiencyScore,
    predictedCompletionDays: 4,
    scrapReductionTip: 'Pattern nesting optimization can save approx. 12m of fabric this week.'
  };

  return res.status(200).json(new ApiResponse(200, aiData, 'AI Factory Insights fetched successfully'));
});

module.exports = {
  getAiInsights,
};