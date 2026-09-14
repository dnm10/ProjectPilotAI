const express = require('express');

const {
  getTeams,
  getTeamMembers,
  getAvailableUsers,
  createTeam,
  addTeamMember,
  updateTeam,
  deleteTeam,
  updateTeamMember,
  removeTeamMember,
} = require('../controllers/teamController');

const router = express.Router();

// Teams
router.get('/list', getTeams);
router.get('/users', getAvailableUsers);
router.get('/', getTeamMembers);

router.post('/', createTeam);
router.put('/:teamId', updateTeam);
router.delete('/:teamId', deleteTeam);

// Team members
router.post('/members', addTeamMember);
router.put('/members/:memberId', updateTeamMember);
router.delete('/members/:memberId', removeTeamMember);

module.exports = router;