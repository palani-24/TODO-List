const mongoose = require('mongoose');

const ballSchema = new mongoose.Schema({
  overNum: { type: Number, required: true },
  ballNum: { type: Number, required: true },
  runs: { type: Number, default: 0 },
  isExtra: { type: Boolean, default: false },
  extraType: { type: String, enum: ['Wide', 'No Ball', 'Bye', 'Leg Bye', 'None'], default: 'None' },
  isWicket: { type: Boolean, default: false },
  wicketType: { type: String, enum: ['Bowled', 'Caught', 'LBW', 'Run Out', 'Stumped', 'Hit Wicket', 'None'], default: 'None' },
  dismissedPlayer: { type: String, default: '' },
  fielder: { type: String, default: '' },
  striker: { type: String, required: true },
  nonStriker: { type: String, default: '' },
  bowler: { type: String, required: true },
  commentary: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
});

const batsmanPerformanceSchema = new mongoose.Schema({
  playerRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  name: { type: String, required: true },
  runs: { type: Number, default: 0 },
  balls: { type: Number, default: 0 },
  fours: { type: Number, default: 0 },
  sixes: { type: Number, default: 0 },
  isOut: { type: Boolean, default: false },
  dismissalInfo: { type: String, default: 'not out' }
});

const bowlerPerformanceSchema = new mongoose.Schema({
  playerRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  name: { type: String, required: true },
  overs: { type: Number, default: 0 },
  legalBalls: { type: Number, default: 0 },
  maidens: { type: Number, default: 0 },
  runs: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  wides: { type: Number, default: 0 },
  noBalls: { type: Number, default: 0 }
});

const inningsSchema = new mongoose.Schema({
  battingTeam: { type: String, required: true },
  bowlingTeam: { type: String, required: true },
  runs: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  overs: { type: Number, default: 0 },
  balls: { type: Number, default: 0 },
  extras: { type: Number, default: 0 },
  batsmen: [batsmanPerformanceSchema],
  bowlers: [bowlerPerformanceSchema],
  ballByBall: [ballSchema]
});

const matchSchema = new mongoose.Schema(
  {
    opponent: {
      type: String,
      required: [true, 'Opponent name is required'],
      trim: true
    },
    teamA: {
      type: String,
      default: 'India'
    },
    teamB: {
      type: String,
      default: function() { return this.opponent; }
    },
    matchDate: {
      type: Date,
      required: [true, 'Match date is required']
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true
    },
    matchType: {
      type: String,
      required: true,
      enum: ['T20', 'ODI', 'Test', 'Practice Match', '10-Over'],
      default: 'T20'
    },
    oversLimit: {
      type: Number,
      default: 20
    },
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tournament',
      default: null
    },
    tossWinner: {
      type: String,
      default: ''
    },
    tossDecision: {
      type: String,
      enum: ['Batting', 'Bowling', ''],
      default: ''
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Live', 'Completed', 'Abandoned'],
      default: 'Upcoming'
    },
    result: {
      type: String,
      enum: ['Won', 'Lost', 'Draw', 'Tied', 'No Result', 'Upcoming', 'Live'],
      default: 'Upcoming'
    },
    winMargin: {
      type: String,
      default: ''
    },
    currentInningsNum: {
      type: Number,
      default: 1
    },
    target: {
      type: Number,
      default: 0
    },
    ourScore: {
      type: String,
      trim: true,
      default: ''
    },
    theirScore: {
      type: String,
      trim: true,
      default: ''
    },
    manOfTheMatch: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    },
    innings1: {
      type: inningsSchema,
      default: () => ({})
    },
    innings2: {
      type: inningsSchema,
      default: () => ({})
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Match', matchSchema);
