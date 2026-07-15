const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  getStats
} = require('../controllers/taskController');

// Stats route must come before /:id to avoid being treated as an id
router.get('/stats/summary', getStats);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

router.patch('/:id/complete', completeTask);

module.exports = router;
