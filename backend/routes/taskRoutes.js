const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  updateStatus,
  addNote,
  deleteNote,
  getStats,
  exportCsv,
  getAllTags
} = require('../controllers/taskController');

// Static routes must come before /:id to avoid being treated as an id
router.get('/stats/summary', getStats);
router.get('/export/csv', exportCsv);
router.get('/tags/all', getAllTags);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

router.patch('/:id/complete', completeTask);
router.patch('/:id/status', updateStatus);

router.route('/:id/notes')
  .post(addNote);

router.delete('/:id/notes/:noteId', deleteNote);

module.exports = router;
