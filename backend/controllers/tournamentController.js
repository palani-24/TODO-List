const Tournament = require('../models/Tournament');
const Match = require('../models/Match');

// @desc    Get all tournaments
// @route   GET /api/tournaments
exports.getTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tournaments.length, data: tournaments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// @desc    Get single tournament & points table
// @route   GET /api/tournaments/:id
exports.getTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    const matches = await Match.find({ tournament: tournament._id }).sort({ matchDate: 1 });

    res.status(200).json({
      success: true,
      data: {
        tournament,
        matches
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// @desc    Create tournament
// @route   POST /api/tournaments
exports.createTournament = async (req, res) => {
  try {
    const { name, format, venue, teams, season } = req.body;
    const teamList = Array.isArray(teams) ? teams : (teams ? teams.split(',').map(t => t.trim()) : ['India', 'Australia', 'England', 'South Africa']);

    const initialPointsTable = teamList.map(t => ({
      teamName: t,
      played: 0,
      won: 0,
      lost: 0,
      tied: 0,
      noResult: 0,
      points: 0,
      nrr: 0,
      runsScored: 0,
      oversFaced: 0,
      runsConceded: 0,
      oversBowled: 0
    }));

    const tournament = await Tournament.create({
      name,
      format,
      venue,
      season,
      teams: teamList,
      pointsTable: initialPointsTable
    });

    res.status(201).json({ success: true, message: 'Tournament created successfully', data: tournament });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Failed to create tournament', error: err.message });
  }
};

// @desc    Recalculate Points Table for a tournament
// @route   POST /api/tournaments/:id/recalculate-points
exports.recalculatePointsTable = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.status(404).json({ success: false, message: 'Tournament not found' });

    const matches = await Match.find({ tournament: tournament._id, status: 'Completed' });

    const table = {};
    tournament.teams.forEach(t => {
      table[t] = { teamName: t, played: 0, won: 0, lost: 0, tied: 0, noResult: 0, points: 0, nrr: 0, runsScored: 0, oversFaced: 0, runsConceded: 0, oversBowled: 0 };
    });

    matches.forEach(m => {
      const tA = m.teamA;
      const tB = m.teamB;
      if (!table[tA]) table[tA] = { teamName: tA, played: 0, won: 0, lost: 0, tied: 0, noResult: 0, points: 0, nrr: 0, runsScored: 0, oversFaced: 0, runsConceded: 0, oversBowled: 0 };
      if (!table[tB]) table[tB] = { teamName: tB, played: 0, won: 0, lost: 0, tied: 0, noResult: 0, points: 0, nrr: 0, runsScored: 0, oversFaced: 0, runsConceded: 0, oversBowled: 0 };

      table[tA].played += 1;
      table[tB].played += 1;

      if (m.result === 'Won') {
        table[tA].won += 1;
        table[tA].points += 2;
        table[tB].lost += 1;
      } else if (m.result === 'Lost') {
        table[tB].won += 1;
        table[tB].points += 2;
        table[tA].lost += 1;
      } else if (m.result === 'Tied' || m.result === 'Draw') {
        table[tA].tied += 1;
        table[tA].points += 1;
        table[tB].tied += 1;
        table[tB].points += 1;
      } else if (m.result === 'No Result') {
        table[tA].noResult += 1;
        table[tA].points += 1;
        table[tB].noResult += 1;
        table[tB].points += 1;
      }
    });

    // Sort by Points descending
    const updatedTable = Object.values(table).sort((a, b) => b.points - a.points || b.won - a.won);

    tournament.pointsTable = updatedTable;
    await tournament.save();

    res.status(200).json({ success: true, message: 'Points table updated', data: tournament.pointsTable });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
