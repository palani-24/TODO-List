const mongoose = require('mongoose');

const pointsTableEntrySchema = new mongoose.Schema({
  teamName: { type: String, required: true, trim: true },
  played: { type: Number, default: 0 },
  won: { type: Number, default: 0 },
  lost: { type: Number, default: 0 },
  tied: { type: Number, default: 0 },
  noResult: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  nrr: { type: Number, default: 0 },
  runsScored: { type: Number, default: 0 },
  oversFaced: { type: Number, default: 0 },
  runsConceded: { type: Number, default: 0 },
  oversBowled: { type: Number, default: 0 }
});

const tournamentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tournament name is required'],
      trim: true
    },
    season: {
      type: String,
      default: '2026'
    },
    format: {
      type: String,
      enum: ['T20', 'ODI', 'Test', '10-Over', 'Box Cricket'],
      default: 'T20'
    },
    venue: {
      type: String,
      default: 'Main Stadium'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Completed'],
      default: 'Ongoing'
    },
    teams: [{ type: String, trim: true }],
    pointsTable: [pointsTableEntrySchema],
    bannerUrl: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tournament', tournamentSchema);
