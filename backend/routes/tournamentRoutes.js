const express = require('express');
const router = express.Router();
const {
  getTournaments,
  getTournament,
  createTournament,
  recalculatePointsTable
} = require('../controllers/tournamentController');

router.route('/').get(getTournaments).post(createTournament);
router.route('/:id').get(getTournament);
router.route('/:id/recalculate-points').post(recalculatePointsTable);

module.exports = router;
