const express = require('express');

const {
  createTickets,
  updateTicketStatus,
} = require('../controllers/ticketController');

const router = express.Router();

router.post('/', createTickets);

router.patch('/:ticketId/status', updateTicketStatus);

module.exports = router;