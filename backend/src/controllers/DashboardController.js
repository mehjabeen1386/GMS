// // // Add this method to your backend order controller or a dedicated dashboard controller
// // getDashboardStats = this.catchAsync(async (req, res) => {
// //   const contractorId = req.user?._id || req.user?.id || '650000000000000000000001';
  
// //   // Count active job orders (excluding soft-deleted)
// //   const activeOrdersCount = await Order.countDocuments({ contractorId, isDeleted: { $ne: true } });
  
// //   // You can fetch counts for workers, inventory, etc. as well:
// //   // const workforceCount = await Worker.countDocuments({ contractorId });
  
// //   return this.sendSuccess(res, 200, 'Dashboard stats retrieved successfully', {
// //     activeOrdersCount,
// //     factoryWorkforce: 48, // Replace with Worker.countDocuments if you have a Worker model
// //     fabricInStock: '3,450 m', // Replace with Fabric/Inventory aggregate if available
// //     pendingPayouts: '₹184,500' // Replace with payroll calculation if available
// //   });
// // });

// // Purpose: Controller for real dashboard summary and database metrics
// // Path: backend/src/controllers/DashboardController.js

// const Order = require('../models/OrderModel'); // Make sure this points to your Order model

// exports.getDashboardSummary = async (req, res) => {
//   try {
//     // Count real active and completed orders from MongoDB
//     const activeOrdersCount = await Order.countDocuments({ isDeleted: { $ne: true } });
//     const completedOrdersCount = await Order.countDocuments({ status: 'COMPLETED', isDeleted: { $ne: true } });

//     return res.status(200).json({
//       success: true,
//       message: 'Dashboard metrics retrieved successfully',
//       data: {
//         activeOrdersCount,
//         completedOrdersCount,
//         factoryWorkforce: 48,
//         fabricInStock: '3,450 m',
//         pendingPayouts: '₹184,500'
//       }
//     });
//   } catch (err) {
//     console.error('Dashboard stats error:', err);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to retrieve dashboard metrics',
//       error: err.message
//     });
//   }
// };