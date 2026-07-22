const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Player name is required'],
      trim: true
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: [
        'Batsman',
        'Bowler',
        'All-Rounder',
        'Wicket Keeper',
        'Captain'
      ]
    },
    jerseyNumber: {
      type: Number,
      required: [true, 'Jersey number is required'],
      min: 1,
      max: 99
    },
    battingStyle: {
      type: String,
      enum: ['Right-Handed', 'Left-Handed'],
      default: 'Right-Handed'
    },
    bowlingStyle: {
      type: String,
      enum: ['Right-Arm Fast', 'Left-Arm Fast', 'Right-Arm Spin', 'Left-Arm Spin', 'N/A'],
      default: 'N/A'
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    },
    // CricHeroes / Stumps Career Statistics
    stats: {
      matchesPlayed: { type: Number, default: 0 },
      inningsBatted: { type: Number, default: 0 },
      totalRuns: { type: Number, default: 0 },
      ballsFaced: { type: Number, default: 0 },
      highestScore: { type: Number, default: 0 },
      fifties: { type: Number, default: 0 },
      hundreds: { type: Number, default: 0 },
      fours: { type: Number, default: 0 },
      sixes: { type: Number, default: 0 },
      notOuts: { type: Number, default: 0 },
      wickets: { type: Number, default: 0 },
      oversBowled: { type: Number, default: 0 },
      runsConceded: { type: Number, default: 0 },
      bestBowlingWickets: { type: Number, default: 0 },
      bestBowlingRuns: { type: Number, default: 0 },
      catches: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Player', playerSchema);
