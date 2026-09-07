const express = require('express');
const { generateTasks } = require('../controllers/aiController');

const router = express.Router();

router.post('/generate-tasks', generateTasks);

module.exports = router;