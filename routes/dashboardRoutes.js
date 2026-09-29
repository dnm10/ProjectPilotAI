const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');

// Routes
router.get('/summary', DashboardController.getDashboardSummary);
router.get('/stats', DashboardController.getStats);
router.get('/risks', DashboardController.getTopRisks);
router.get('/workload', DashboardController.getWorkloadSummary);
router.get('/activity', DashboardController.getRecentActivity);

module.exports = router;
