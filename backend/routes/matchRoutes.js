const express = require('express');
const router = express.Router();
const {
  getMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch,
  getUpcoming
} = require('../controllers/matchController');

const {
  startLiveMatch,
  submitBall,
  completeLiveMatch,
  endFirstInnings
} = require('../controllers/scoringController');

router.get('/upcoming', getUpcoming);

router.post('/:id/start-live', startLiveMatch);
router.post('/:id/ball', submitBall);
router.post('/:id/complete-live', completeLiveMatch);
router.post('/:id/end-first-innings', endFirstInnings);

router.route('/')
  .get(getMatches)
  .post(createMatch);

router.route('/:id')
  .get(getMatch)
  .put(updateMatch)
  .delete(deleteMatch);

module.exports = router;
