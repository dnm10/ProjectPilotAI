const express = require('express');
const {
  getSprints,
  createSprint,
  getSprintTickets,
  deleteSprint,
} = require('../controllers/sprintController');

const router = express.Router();

// Sprint CRUD & tickets
router.get('/', getSprints);
router.post('/', createSprint);
router.get('/:sprintId/tickets', getSprintTickets);
router.delete('/:sprintId', deleteSprint);

module.exports = router;