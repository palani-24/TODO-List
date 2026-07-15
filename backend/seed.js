// Seed script - populates MongoDB with sample cricket tasks
// Run with: node seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Task = require('./models/Task');

const sampleTasks = [
  {
    taskName: 'Batting Practice',
    category: 'Batting Practice',
    assignedTo: 'Opening Batsmen',
    priority: 'High',
    practiceDate: new Date('2026-07-20'),
    status: 'Pending',
    description: 'Focus on facing new-ball swing and building an innings against the second string bowling attack.'
  },
  {
    taskName: 'Bowling Practice',
    category: 'Bowling Practice',
    assignedTo: 'Fast Bowlers',
    priority: 'Medium',
    practiceDate: new Date('2026-07-20'),
    status: 'Completed',
    description: 'Work on yorkers and death-over variations in the nets.'
  },
  {
    taskName: 'Fielding Practice',
    category: 'Fielding Practice',
    assignedTo: 'Fielders',
    priority: 'High',
    practiceDate: new Date('2026-07-21'),
    status: 'Pending',
    description: 'Ground fielding, slip catching, and direct hit drills.'
  },
  {
    taskName: 'Fitness Training',
    category: 'Fitness Training',
    assignedTo: 'Entire Team',
    priority: 'Medium',
    practiceDate: new Date('2026-07-21'),
    status: 'Pending',
    description: 'Endurance and strength conditioning session with the fitness trainer.'
  },
  {
    taskName: 'Team Strategy Meeting',
    category: 'Team Meeting',
    assignedTo: 'Captain',
    priority: 'High',
    practiceDate: new Date('2026-07-22'),
    status: 'Pending',
    description: 'Discuss batting order and bowling plans for the upcoming match.'
  },
  {
    taskName: 'Warm-up Session',
    category: 'Warm-up',
    assignedTo: 'Entire Team',
    priority: 'Low',
    practiceDate: new Date('2026-07-22'),
    status: 'Completed',
    description: 'Dynamic stretching and light jogging before nets.'
  },
  {
    taskName: 'Video Analysis',
    category: 'Video Analysis',
    assignedTo: 'Coach',
    priority: 'Medium',
    practiceDate: new Date('2026-07-23'),
    status: 'Pending',
    description: 'Review footage of the opposition\'s bowlers.'
  },
  {
    taskName: 'Equipment Check',
    category: 'Equipment Check',
    assignedTo: 'Entire Team',
    priority: 'Low',
    practiceDate: new Date('2026-07-23'),
    status: 'Pending',
    description: 'Inspect bats, pads, helmets, and kit bags before travel.'
  }
];

const seedDB = async () => {
  await connectDB();
  await Task.deleteMany({});
  await Task.insertMany(sampleTasks);
  console.log(`✅ Seeded ${sampleTasks.length} sample tasks`);
  mongoose.connection.close();
};

seedDB();
