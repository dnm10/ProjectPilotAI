const express = require('express');

const {
  getTeams,
  getTeamMembers,
  getAvailableUsers,
  createTeam,
  addTeamMember,
} = require('../controllers/teamController');

const router = express.Router();

router.get('/list', getTeams);
router.get('/users', getAvailableUsers);
router.get('/', getTeamMembers);
router.post('/', createTeam);
router.post('/members', addTeamMember);

module.exports = router;