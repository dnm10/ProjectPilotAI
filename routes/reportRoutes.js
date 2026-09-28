const express = require('express');
const { getLatestReport, getReportById } = require('../controllers/reportController');

const router = express.Router();

// GET /reports/latest or /api/reports/latest
router.get('/latest', getLatestReport);

// GET /reports/:report_id or /api/reports/:report_id
router.get('/:report_id', getReportById);

module.exports = router;
