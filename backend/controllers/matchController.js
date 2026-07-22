const Match = require('../models/Match');
const mongoose = require('mongoose');

let memoryMatches = [
  {
    _id: 'm1',
    opponent: 'Australia',
    teamA: 'India',
    teamB: 'Australia',
    matchDate: new Date('2026-07-25').toISOString(),
    venue: 'MCG, Melbourne',
    matchType: 'T20',
    status: 'Upcoming',
    result: 'Upcoming',
    notes: 'First match of the T20 series'
  },
  {
    _id: 'm2',
    opponent: 'Australia',
    teamA: 'India',
    teamB: 'Australia',
    matchDate: new Date('2026-07-28').toISOString(),
    venue: 'SCG, Sydney',
    matchType: 'T20',
    status: 'Upcoming',
    result: 'Upcoming',
    notes: 'Second T20I'
  },
  {
    _id: 'm3',
    opponent: 'South Africa',
    teamA: 'India',
    teamB: 'South Africa',
    matchDate: new Date('2026-07-18').toISOString(),
    venue: 'Wankhede, Mumbai',
    matchType: 'T20',
    status: 'Completed',
    result: 'Won',
    ourScore: '189/4 (20.0)',
    theirScore: '156/8 (20.0)',
    winMargin: 'India won by 33 runs',
    manOfTheMatch: 'Rohit Sharma',
    notes: 'Great bowling effort in death overs'
  },
  {
    _id: 'm4',
    opponent: 'South Africa',
    teamA: 'India',
    teamB: 'South Africa',
    matchDate: new Date('2026-07-15').toISOString(),
    venue: 'Eden Gardens, Kolkata',
    matchType: 'T20',
    status: 'Completed',
    result: 'Won',
    ourScore: '204/3 (20.0)',
    theirScore: '178/7 (20.0)',
    winMargin: 'India won by 26 runs',
    manOfTheMatch: 'Virat Kohli'
  }
];

exports.getMatches = async (req, res) => {
  try {
    const { matchType, result } = req.query;
    if (mongoose.connection.readyState === 1) {
      const query = {};
      if (matchType) query.matchType = matchType;
      if (result) query.result = result;
      const matches = await Match.find(query).sort({ matchDate: 1 });
      return res.status(200).json({ success: true, count: matches.length, data: matches });
    }

    let list = [...memoryMatches];
    if (matchType) list = list.filter(m => m.matchType === matchType);
    if (result) list = list.filter(m => m.result === result);

    res.status(200).json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getMatch = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const match = await Match.findById(req.params.id);
      if (!match) return res.status(404).json({ success: false, message: 'Match not found' });
      return res.status(200).json({ success: true, data: match });
    }

    const match = memoryMatches.find(m => m._id === req.params.id);
    if (!match) return res.status(404).json({ success: false, message: 'Match not found' });
    res.status(200).json({ success: true, data: match });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.createMatch = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const match = await Match.create(req.body);
      return res.status(201).json({ success: true, message: 'Match scheduled successfully', data: match });
    }

    const newMatch = {
      _id: 'm' + Date.now(),
      teamA: 'India',
      teamB: req.body.opponent,
      status: 'Upcoming',
      result: 'Upcoming',
      ...req.body
    };
    memoryMatches.push(newMatch);
    res.status(201).json({ success: true, message: 'Match scheduled successfully', data: newMatch });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Failed to schedule match', error: err.message });
  }
};

exports.updateMatch = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const match = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!match) return res.status(404).json({ success: false, message: 'Match not found' });
      return res.status(200).json({ success: true, message: 'Match updated successfully', data: match });
    }

    const idx = memoryMatches.findIndex(m => m._id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Match not found' });
    memoryMatches[idx] = { ...memoryMatches[idx], ...req.body };
    res.status(200).json({ success: true, message: 'Match updated successfully', data: memoryMatches[idx] });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Failed to update match', error: err.message });
  }
};

exports.deleteMatch = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const match = await Match.findByIdAndDelete(req.params.id);
      if (!match) return res.status(404).json({ success: false, message: 'Match not found' });
      return res.status(200).json({ success: true, message: 'Match deleted successfully', data: match });
    }

    const idx = memoryMatches.findIndex(m => m._id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Match not found' });
    const deleted = memoryMatches.splice(idx, 1)[0];
    res.status(200).json({ success: true, message: 'Match deleted successfully', data: deleted });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete match', error: err.message });
  }
};

exports.getUpcoming = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const matches = await Match.find({ matchDate: { $gte: today }, result: 'Upcoming' }).sort({ matchDate: 1 }).limit(5);
      return res.status(200).json({ success: true, count: matches.length, data: matches });
    }

    const upcoming = memoryMatches.filter(m => m.result === 'Upcoming');
    res.status(200).json({ success: true, count: upcoming.length, data: upcoming });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
