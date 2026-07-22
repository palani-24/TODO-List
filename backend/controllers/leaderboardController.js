const Player = require('../models/Player');

// @desc    Get CricHeroes Leaderboards (Orange Cap, Purple Cap, Most 6s, Highest Score)
// @route   GET /api/leaderboard
exports.getLeaderboards = async (req, res) => {
  try {
    const players = await Player.find({ isActive: true });

    // 1. Orange Cap (Top Run Scorers)
    const orangeCap = [...players]
      .sort((a, b) => (b.stats?.totalRuns || 0) - (a.stats?.totalRuns || 0))
      .slice(0, 10)
      .map(p => {
        const sr = p.stats.ballsFaced > 0 ? ((p.stats.totalRuns / p.stats.ballsFaced) * 100).toFixed(1) : '0.0';
        const avg = (p.stats.inningsBatted - p.stats.notOuts) > 0
          ? (p.stats.totalRuns / (p.stats.inningsBatted - p.stats.notOuts)).toFixed(1)
          : p.stats.totalRuns;
        return {
          _id: p._id,
          name: p.name,
          role: p.role,
          jerseyNumber: p.jerseyNumber,
          runs: p.stats.totalRuns,
          innings: p.stats.inningsBatted,
          highestScore: p.stats.highestScore,
          average: avg,
          strikeRate: sr,
          fours: p.stats.fours,
          sixes: p.stats.sixes,
          fifties: p.stats.fifties,
          hundreds: p.stats.hundreds
        };
      });

    // 2. Purple Cap (Top Wicket Takers)
    const purpleCap = [...players]
      .filter(p => (p.stats?.wickets || 0) > 0 || p.role === 'Bowler' || p.role === 'All-Rounder')
      .sort((a, b) => (b.stats?.wickets || 0) - (a.stats?.wickets || 0))
      .slice(0, 10)
      .map(p => {
        const eco = p.stats.oversBowled > 0 ? (p.stats.runsConceded / p.stats.oversBowled).toFixed(2) : '0.00';
        return {
          _id: p._id,
          name: p.name,
          role: p.role,
          jerseyNumber: p.jerseyNumber,
          wickets: p.stats.wickets,
          overs: p.stats.oversBowled,
          runsConceded: p.stats.runsConceded,
          economy: eco,
          bestBowling: `${p.stats.bestBowlingWickets}/${p.stats.bestBowlingRuns}`
        };
      });

    // 3. Sixes Kings
    const sixesKings = [...players]
      .sort((a, b) => (b.stats?.sixes || 0) - (a.stats?.sixes || 0))
      .slice(0, 5)
      .map(p => ({
        _id: p._id,
        name: p.name,
        sixes: p.stats.sixes,
        fours: p.stats.fours,
        runs: p.stats.totalRuns
      }));

    res.status(200).json({
      success: true,
      data: {
        orangeCap,
        purpleCap,
        sixesKings
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
