const express = require('express');
const { getSprintTickets } = require('../controllers/sprintController');
const { createSprint } = require('../controllers/sprintCreateController');
const { getSprints } = require('../controllers/sprintListController');

const router = express.Router();


router.get('/', getSprints);
router.get('/:sprintId/tickets', getSprintTickets);

router.post('/', createSprint);

module.exports = router;