const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    taskName: {
      type: String,
      required: [true, 'Task name is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Batting Practice',
        'Bowling Practice',
        'Fielding Practice',
        'Fitness Training',
        'Match Strategy',
        'Warm-up',
        'Recovery',
        'Team Meeting',
        'Video Analysis',
        'Travel',
        'Equipment Check'
      ]
    },
    assignedTo: {
      type: String,
      required: [true, 'Assigned To is required'],
      enum: [
        'Opening Batsmen',
        'Middle Order',
        'Finishers',
        'Fast Bowlers',
        'Spin Bowlers',
        'Fielders',
        'Wicket Keeper',
        'Captain',
        'Coach',
        'Entire Team'
      ]
    },
    priority: {
      type: String,
      required: true,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium'
    },
    practiceDate: {
      type: Date,
      required: [true, 'Practice date is required']
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending'
    },
    description: {
      type: String,
      trim: true,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
