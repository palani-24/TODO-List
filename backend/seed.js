// Seed script — populates MongoDB with sample data for all entities
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Task = require('./models/Task');
const Player = require('./models/Player');
const Match = require('./models/Match');
const Notification = require('./models/Notification');
const Tournament = require('./models/Tournament');

const samplePlayers = [
  { name: 'Rohit Sharma', role: 'Batsman', jerseyNumber: 45, battingStyle: 'Right-Handed', bowlingStyle: 'Right-Arm Spin', phone: '9876543210', isActive: true, stats: { matchesPlayed: 14, inningsBatted: 14, totalRuns: 542, ballsFaced: 360, highestScore: 121, fifties: 4, hundreds: 1, fours: 48, sixes: 24, notOuts: 2, wickets: 2, oversBowled: 4, runsConceded: 32 } },
  { name: 'Virat Kohli', role: 'Batsman', jerseyNumber: 18, battingStyle: 'Right-Handed', bowlingStyle: 'Right-Arm Fast', phone: '9876543211', isActive: true, stats: { matchesPlayed: 15, inningsBatted: 15, totalRuns: 680, ballsFaced: 490, highestScore: 117, fifties: 5, hundreds: 2, fours: 62, sixes: 18, notOuts: 3, wickets: 0 } },
  { name: 'Jasprit Bumrah', role: 'Bowler', jerseyNumber: 93, battingStyle: 'Right-Handed', bowlingStyle: 'Right-Arm Fast', phone: '9876543212', isActive: true, stats: { matchesPlayed: 12, inningsBatted: 4, totalRuns: 28, ballsFaced: 20, highestScore: 14, wickets: 24, oversBowled: 46, runsConceded: 290, bestBowlingWickets: 5, bestBowlingRuns: 18 } },
  { name: 'Ravindra Jadeja', role: 'All-Rounder', jerseyNumber: 8, battingStyle: 'Left-Handed', bowlingStyle: 'Left-Arm Spin', phone: '9876543213', isActive: true, stats: { matchesPlayed: 15, inningsBatted: 10, totalRuns: 310, ballsFaced: 220, highestScore: 62, fifties: 2, fours: 24, sixes: 12, notOuts: 4, wickets: 18, oversBowled: 52, runsConceded: 340 } },
  { name: 'Rishabh Pant', role: 'Wicket Keeper', jerseyNumber: 17, battingStyle: 'Left-Handed', bowlingStyle: 'N/A', phone: '9876543214', isActive: true, stats: { matchesPlayed: 12, inningsBatted: 11, totalRuns: 390, ballsFaced: 260, highestScore: 89, fifties: 3, fours: 35, sixes: 22, notOuts: 1, catches: 18 } },
  { name: 'Hardik Pandya', role: 'All-Rounder', jerseyNumber: 33, battingStyle: 'Right-Handed', bowlingStyle: 'Right-Arm Fast', phone: '9876543215', isActive: true, stats: { matchesPlayed: 13, inningsBatted: 9, totalRuns: 280, ballsFaced: 180, highestScore: 71, fifties: 2, fours: 20, sixes: 16, wickets: 14, oversBowled: 38, runsConceded: 275 } },
  { name: 'Suryakumar Yadav', role: 'Batsman', jerseyNumber: 63, battingStyle: 'Right-Handed', bowlingStyle: 'N/A', phone: '9876543216', isActive: true, stats: { matchesPlayed: 14, inningsBatted: 13, totalRuns: 460, ballsFaced: 270, highestScore: 112, fifties: 3, hundreds: 1, fours: 40, sixes: 28, notOuts: 2 } },
  { name: 'Yuzvendra Chahal', role: 'Bowler', jerseyNumber: 3, battingStyle: 'Right-Handed', bowlingStyle: 'Right-Arm Spin', phone: '9876543217', isActive: true, stats: { matchesPlayed: 11, wickets: 19, oversBowled: 42, runsConceded: 310, bestBowlingWickets: 4, bestBowlingRuns: 25 } },
  { name: 'Mohammed Shami', role: 'Bowler', jerseyNumber: 11, battingStyle: 'Right-Handed', bowlingStyle: 'Right-Arm Fast', phone: '9876543219', isActive: true, stats: { matchesPlayed: 10, wickets: 21, oversBowled: 38, runsConceded: 260, bestBowlingWickets: 5, bestBowlingRuns: 22 } },
  { name: 'Shubman Gill', role: 'Batsman', jerseyNumber: 77, battingStyle: 'Right-Handed', bowlingStyle: 'Right-Arm Spin', phone: '9876543220', isActive: true, stats: { matchesPlayed: 12, inningsBatted: 12, totalRuns: 410, ballsFaced: 310, highestScore: 94, fifties: 3, fours: 42, sixes: 11, notOuts: 1 } }
];

const sampleTournaments = [
  {
    name: 'Champions Trophy T20 2026',
    season: '2026',
    format: 'T20',
    venue: 'Wankhede & MCG',
    status: 'Ongoing',
    teams: ['India', 'Australia', 'England', 'South Africa'],
    pointsTable: [
      { teamName: 'India', played: 3, won: 3, lost: 0, tied: 0, noResult: 0, points: 6, nrr: 1.45 },
      { teamName: 'Australia', played: 3, won: 2, lost: 1, tied: 0, noResult: 0, points: 4, nrr: 0.82 },
      { teamName: 'South Africa', played: 3, won: 1, lost: 2, tied: 0, noResult: 0, points: 2, nrr: -0.34 },
      { teamName: 'England', played: 3, won: 0, lost: 3, tied: 0, noResult: 0, points: 0, nrr: -1.93 }
    ]
  },
  {
    name: 'Premier League 10-Over Cup',
    season: '2026',
    format: '10-Over',
    venue: 'NCA Ground, Bangalore',
    status: 'Upcoming',
    teams: ['India XI', 'Practice XI', 'Royals XI', 'Titan XI'],
    pointsTable: [
      { teamName: 'India XI', played: 0, won: 0, lost: 0, tied: 0, noResult: 0, points: 0, nrr: 0 },
      { teamName: 'Practice XI', played: 0, won: 0, lost: 0, tied: 0, noResult: 0, points: 0, nrr: 0 }
    ]
  }
];

const sampleMatches = [
  { opponent: 'Australia', matchDate: new Date('2026-07-25'), venue: 'MCG, Melbourne', matchType: 'T20', status: 'Upcoming', result: 'Upcoming', notes: 'First match of the series' },
  { opponent: 'Australia', matchDate: new Date('2026-07-28'), venue: 'SCG, Sydney', matchType: 'T20', status: 'Upcoming', result: 'Upcoming', notes: 'Second T20I' },
  { opponent: 'South Africa', matchDate: new Date('2026-07-18'), venue: 'Wankhede, Mumbai', matchType: 'T20', status: 'Completed', result: 'Won', ourScore: '189/4 (20.0)', theirScore: '156/8 (20.0)', winMargin: 'India won by 33 runs', manOfTheMatch: 'Rohit Sharma' },
  { opponent: 'South Africa', matchDate: new Date('2026-07-15'), venue: 'Eden Gardens, Kolkata', matchType: 'T20', status: 'Completed', result: 'Won', ourScore: '204/3 (20.0)', theirScore: '178/7 (20.0)', winMargin: 'India won by 26 runs', manOfTheMatch: 'Virat Kohli' }
];

const sampleTasks = [
  {
    taskName: 'Batting Practice — Power Hitting',
    category: 'Batting Practice',
    assignedTo: 'Opening Batsmen',
    priority: 'High',
    practiceDate: new Date('2026-07-20'),
    status: 'Pending',
    description: 'Focus on facing new-ball swing and building an innings against the second string bowling attack.',
    tags: ['nets', 'match-prep', 'power-play'],
    notes: [
      { text: 'Focus on playing through the V in the first 10 overs', author: 'Coach' },
      { text: 'Rohit needs extra practice against left-arm pace', author: 'Analyst' }
    ]
  },
  {
    taskName: 'Bowling Practice — Death Overs',
    category: 'Bowling Practice',
    assignedTo: 'Fast Bowlers',
    priority: 'Medium',
    practiceDate: new Date('2026-07-20'),
    status: 'Completed',
    description: 'Work on yorkers and death-over variations in the nets.',
    tags: ['nets', 'death-overs', 'yorkers'],
    notes: [{ text: 'Bumrah bowled 50 yorkers accurately, great session', author: 'Coach' }]
  },
  {
    taskName: 'Team Strategy Meeting — Aus Tour',
    category: 'Team Meeting',
    assignedTo: 'Captain',
    priority: 'High',
    practiceDate: new Date('2026-07-22'),
    status: 'Pending',
    description: 'Discuss batting order and bowling plans for the upcoming Australia tour.',
    tags: ['strategy', 'meeting', 'australia-tour']
  }
];

const seedDB = async () => {
  await connectDB();

  // Clear all collections
  await Task.deleteMany({});
  await Player.deleteMany({});
  await Match.deleteMany({});
  await Notification.deleteMany({});
  await Tournament.deleteMany({});

  // Seed players
  const players = await Player.insertMany(samplePlayers);
  console.log(`✅ Seeded ${players.length} players with career stats`);

  // Seed tournaments
  const tournaments = await Tournament.insertMany(sampleTournaments);
  console.log(`✅ Seeded ${tournaments.length} tournaments`);

  // Seed matches
  const matches = await Match.insertMany(sampleMatches);
  console.log(`✅ Seeded ${matches.length} matches`);

  // Seed tasks
  const tasks = await Task.insertMany(sampleTasks);
  console.log(`✅ Seeded ${tasks.length} tasks`);

  // Seed notifications
  const sampleNotifications = [
    { message: `New task created: ${tasks[0].taskName}`, type: 'info', taskRef: tasks[0]._id },
    { message: `Task completed: ${tasks[1].taskName}`, type: 'success', taskRef: tasks[1]._id },
    { message: `Match scheduled: India vs ${matches[0].opponent} on ${matches[0].matchDate.toDateString()}`, type: 'info', matchRef: matches[0]._id },
    { message: `Player ${players[0].name} awarded Orange Cap ranking`, type: 'success' }
  ];

  await Notification.insertMany(sampleNotifications);
  console.log(`✅ Seeded ${sampleNotifications.length} notifications`);

  console.log('\n🏏 Database seeded successfully with CricHeroes & Stumps data!\n');
  mongoose.connection.close();
};

seedDB();
