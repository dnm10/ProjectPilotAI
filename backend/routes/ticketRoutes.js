const express = require('express');
const { createTickets } = require('../controllers/ticketController');

const router = express.Router();

router.post('/', createTickets);

module.exports = router;