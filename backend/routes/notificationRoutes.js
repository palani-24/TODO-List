const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markRead,
  markAllRead,
  deleteNotification,
  clearAll
} = require('../controllers/notificationController');

router.patch('/read-all', markAllRead);

router.route('/')
  .get(getNotifications)
  .delete(clearAll);

router.route('/:id')
  .delete(deleteNotification);

router.patch('/:id/read', markRead);

module.exports = router;
