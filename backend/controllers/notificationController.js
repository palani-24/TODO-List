const Notification = require('../models/Notification');

// @desc    Get all notifications (newest first)
// @route   GET /api/notifications
exports.getNotifications = async (req, res) => {
  try {
    const { unreadOnly } = req.query;
    const query = {};
    if (unreadOnly === 'true') query.isRead = false;

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('taskRef', 'taskName')
      .populate('matchRef', 'opponent matchDate');
    const unreadCount = await Notification.countDocuments({ isRead: false });

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: notifications
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
exports.markRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.status(200).json({ success: true, data: notification });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// @desc    Clear all notifications
// @route   DELETE /api/notifications
exports.clearAll = async (req, res) => {
  try {
    await Notification.deleteMany({});
    res.status(200).json({ success: true, message: 'All notifications cleared' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Helper: create a notification (used by other controllers)
exports.createNotification = async (message, type = 'info', taskRef = null, matchRef = null) => {
  try {
    await Notification.create({ message, type, taskRef, matchRef });
  } catch (err) {
    console.error('Failed to create notification:', err.message);
  }
};
