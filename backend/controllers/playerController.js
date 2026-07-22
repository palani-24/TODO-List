const Player = require('../models/Player');
const mongoose = require('mongoose');

// In-memory fallback dataset for offline / non-connected mode
let memoryPlayers = [
  { _id: 'p1', name: 'Rohit Sharma', role: 'Captain', jerseyNumber: 45, battingStyle: 'Right-Handed', bowlingStyle: 'Right-Arm Spin', phone: '9876543210', isActive: true, stats: { matchesPlayed: 14, inningsBatted: 14, totalRuns: 542, ballsFaced: 360, highestScore: 121, fifties: 4, hundreds: 1, fours: 48, sixes: 24, notOuts: 2, wickets: 2, oversBowled: 4, runsConceded: 32 } },
  { _id: 'p2', name: 'Virat Kohli', role: 'Batsman', jerseyNumber: 18, battingStyle: 'Right-Handed', bowlingStyle: 'Right-Arm Fast', phone: '9876543211', isActive: true, stats: { matchesPlayed: 15, inningsBatted: 15, totalRuns: 680, ballsFaced: 490, highestScore: 117, fifties: 5, hundreds: 2, fours: 62, sixes: 18, notOuts: 3, wickets: 0 } },
  { _id: 'p3', name: 'Jasprit Bumrah', role: 'Bowler', jerseyNumber: 93, battingStyle: 'Right-Handed', bowlingStyle: 'Right-Arm Fast', phone: '9876543212', isActive: true, stats: { matchesPlayed: 12, inningsBatted: 4, totalRuns: 28, ballsFaced: 20, highestScore: 14, wickets: 24, oversBowled: 46, runsConceded: 290, bestBowlingWickets: 5, bestBowlingRuns: 18 } },
  { _id: 'p4', name: 'Ravindra Jadeja', role: 'All-Rounder', jerseyNumber: 8, battingStyle: 'Left-Handed', bowlingStyle: 'Left-Arm Spin', phone: '9876543213', isActive: true, stats: { matchesPlayed: 15, inningsBatted: 10, totalRuns: 310, ballsFaced: 220, highestScore: 62, fifties: 2, fours: 24, sixes: 12, notOuts: 4, wickets: 18, oversBowled: 52, runsConceded: 340 } },
  { _id: 'p5', name: 'Rishabh Pant', role: 'Wicket Keeper', jerseyNumber: 17, battingStyle: 'Left-Handed', bowlingStyle: 'N/A', phone: '9876543214', isActive: true, stats: { matchesPlayed: 12, inningsBatted: 11, totalRuns: 390, ballsFaced: 260, highestScore: 89, fifties: 3, fours: 35, sixes: 22, notOuts: 1, catches: 18 } },
  { _id: 'p6', name: 'Hardik Pandya', role: 'All-Rounder', jerseyNumber: 33, battingStyle: 'Right-Handed', bowlingStyle: 'Right-Arm Fast', phone: '9876543215', isActive: true, stats: { matchesPlayed: 13, inningsBatted: 9, totalRuns: 280, ballsFaced: 180, highestScore: 71, fifties: 2, fours: 20, sixes: 16, wickets: 14, oversBowled: 38, runsConceded: 275 } },
  { _id: 'p7', name: 'Suryakumar Yadav', role: 'Batsman', jerseyNumber: 63, battingStyle: 'Right-Handed', bowlingStyle: 'N/A', phone: '9876543216', isActive: true, stats: { matchesPlayed: 14, inningsBatted: 13, totalRuns: 460, ballsFaced: 270, highestScore: 112, fifties: 3, hundreds: 1, fours: 40, sixes: 28, notOuts: 2 } },
  { _id: 'p8', name: 'Yuzvendra Chahal', role: 'Bowler', jerseyNumber: 3, battingStyle: 'Right-Handed', bowlingStyle: 'Right-Arm Spin', phone: '9876543217', isActive: true, stats: { matchesPlayed: 11, wickets: 19, oversBowled: 42, runsConceded: 310, bestBowlingWickets: 4, bestBowlingRuns: 25 } },
  { _id: 'p9', name: 'Mohammed Shami', role: 'Bowler', jerseyNumber: 11, battingStyle: 'Right-Handed', bowlingStyle: 'Right-Arm Fast', phone: '9876543219', isActive: true, stats: { matchesPlayed: 10, wickets: 21, oversBowled: 38, runsConceded: 260, bestBowlingWickets: 5, bestBowlingRuns: 22 } },
  { _id: 'p10', name: 'Shubman Gill', role: 'Batsman', jerseyNumber: 77, battingStyle: 'Right-Handed', bowlingStyle: 'Right-Arm Spin', phone: '9876543220', isActive: true, stats: { matchesPlayed: 12, inningsBatted: 12, totalRuns: 410, ballsFaced: 310, highestScore: 94, fifties: 3, fours: 42, sixes: 11, notOuts: 1 } }
];

exports.getPlayers = async (req, res) => {
  try {
    const { search, role, isActive } = req.query;
    if (mongoose.connection.readyState === 1) {
      const query = {};
      if (search) query.name = { $regex: search, $options: 'i' };
      if (role) query.role = role;
      if (isActive !== undefined) query.isActive = isActive === 'true';
      const players = await Player.find(query).sort({ jerseyNumber: 1 });
      return res.status(200).json({ success: true, count: players.length, data: players });
    }

    let result = [...memoryPlayers];
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (role) result = result.filter(p => p.role === role);
    if (isActive !== undefined) result = result.filter(p => p.isActive === (isActive === 'true'));

    res.status(200).json({ success: true, count: result.length, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getPlayer = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const player = await Player.findById(req.params.id);
      if (!player) return res.status(404).json({ success: false, message: 'Player not found' });
      return res.status(200).json({ success: true, data: player });
    }

    const player = memoryPlayers.find(p => p._id === req.params.id);
    if (!player) return res.status(404).json({ success: false, message: 'Player not found' });
    res.status(200).json({ success: true, data: player });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.createPlayer = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const player = await Player.create(req.body);
      return res.status(201).json({ success: true, message: 'Player added successfully', data: player });
    }

    const newPlayer = { _id: 'p' + Date.now(), ...req.body, isActive: req.body.isActive !== false, stats: { matchesPlayed: 0 } };
    memoryPlayers.push(newPlayer);
    res.status(201).json({ success: true, message: 'Player added successfully', data: newPlayer });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Failed to add player', error: err.message });
  }
};

exports.updatePlayer = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!player) return res.status(404).json({ success: false, message: 'Player not found' });
      return res.status(200).json({ success: true, message: 'Player updated successfully', data: player });
    }

    const idx = memoryPlayers.findIndex(p => p._id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Player not found' });
    memoryPlayers[idx] = { ...memoryPlayers[idx], ...req.body };
    res.status(200).json({ success: true, message: 'Player updated successfully', data: memoryPlayers[idx] });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Failed to update player', error: err.message });
  }
};

exports.deletePlayer = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const player = await Player.findByIdAndDelete(req.params.id);
      if (!player) return res.status(404).json({ success: false, message: 'Player not found' });
      return res.status(200).json({ success: true, message: 'Player deleted successfully', data: player });
    }

    const idx = memoryPlayers.findIndex(p => p._id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Player not found' });
    const deleted = memoryPlayers.splice(idx, 1)[0];
    res.status(200).json({ success: true, message: 'Player deleted successfully', data: deleted });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete player', error: err.message });
  }
};

exports.getPlayerStats = async (req, res) => {
  try {
    const total = memoryPlayers.length;
    const active = memoryPlayers.filter(p => p.isActive).length;
    res.status(200).json({
      success: true,
      data: { total, active, inactive: total - active, byRole: [] }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
