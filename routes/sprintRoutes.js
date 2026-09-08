const express = require('express');
const {
  getSprintTickets,
  deleteSprint,
} = require('../controllers/sprintController');
const { createSprint } = require('../controllers/sprintCreateController');
const { getSprints } = require('../controllers/sprintListController');

const router = express.Router();


router.get('/', getSprints);
router.get('/:sprintId/tickets', getSprintTickets);

router.post('/', createSprint);
router.delete('/:sprintId', deleteSprint);

module.exports = router;