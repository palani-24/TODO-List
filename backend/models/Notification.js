const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    taskRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      default: null
    },
    matchRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
