const Match = require('../models/Match');
const mongoose = require('mongoose');

let memoryMatchesStore = {};

exports.startLiveMatch = async (req, res) => {
  try {
    const { tossWinner, tossDecision, battingTeam, bowlingTeam, oversLimit } = req.body;
    let match;

    if (mongoose.connection.readyState === 1) {
      match = await Match.findById(req.params.id);
    } else {
      if (!memoryMatchesStore[req.params.id]) {
        memoryMatchesStore[req.params.id] = {
          _id: req.params.id,
          opponent: 'Australia',
          teamA: 'India',
          teamB: 'Australia',
          matchDate: new Date().toISOString(),
          venue: 'MCG, Melbourne',
          matchType: 'T20',
          oversLimit: 20
        };
      }
      match = memoryMatchesStore[req.params.id];
    }

    if (!match) return res.status(404).json({ success: false, message: 'Match not found' });

    match.status = 'Live';
    match.result = 'Live';
    if (tossWinner) match.tossWinner = tossWinner;
    if (tossDecision) match.tossDecision = tossDecision;
    if (oversLimit) match.oversLimit = Number(oversLimit);

    match.currentInningsNum = 1;
    match.innings1 = {
      battingTeam: battingTeam || (tossDecision === 'Batting' ? tossWinner : (tossWinner === (match.teamA || 'India') ? (match.teamB || 'Australia') : (match.teamA || 'India'))),
      bowlingTeam: bowlingTeam || 'Australia',
      runs: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      extras: 0,
      batsmen: [],
      bowlers: [],
      ballByBall: []
    };

    if (mongoose.connection.readyState === 1 && typeof match.save === 'function') {
      await match.save();
    } else {
      memoryMatchesStore[req.params.id] = match;
    }

    res.status(200).json({ success: true, message: 'Live match started!', data: match });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to start live match', error: err.message });
  }
};

exports.submitBall = async (req, res) => {
  try {
    const { runs, isExtra, extraType, isWicket, wicketType, striker, nonStriker, bowler, dismissedPlayer, fielder } = req.body;
    let match;

    if (mongoose.connection.readyState === 1) {
      match = await Match.findById(req.params.id);
    } else {
      match = memoryMatchesStore[req.params.id];
    }

    if (!match) {
      match = {
        _id: req.params.id,
        status: 'Live',
        result: 'Live',
        currentInningsNum: 1,
        teamA: 'India',
        teamB: 'Australia',
        oversLimit: 20,
        innings1: { battingTeam: 'India', bowlingTeam: 'Australia', runs: 0, wickets: 0, overs: 0, balls: 0, extras: 0, batsmen: [], bowlers: [], ballByBall: [] }
      };
      memoryMatchesStore[req.params.id] = match;
    }

    const inningsKey = match.currentInningsNum === 1 ? 'innings1' : 'innings2';
    if (!match[inningsKey]) {
      match[inningsKey] = { battingTeam: 'India', bowlingTeam: 'Australia', runs: 0, wickets: 0, overs: 0, balls: 0, extras: 0, batsmen: [], bowlers: [], ballByBall: [] };
    }
    const innings = match[inningsKey];

    const runsScored = Number(runs) || 0;
    let extraRuns = 0;
    let isLegalBall = true;

    if (isExtra) {
      if (extraType === 'Wide' || extraType === 'No Ball') {
        extraRuns = 1 + runsScored;
        isLegalBall = false;
      } else if (extraType === 'Bye' || extraType === 'Leg Bye') {
        extraRuns = runsScored;
        isLegalBall = true;
      }
    }

    const totalBallRuns = isExtra && (extraType === 'Wide' || extraType === 'No Ball') ? extraRuns : runsScored;

    if (isLegalBall) {
      innings.balls += 1;
      if (innings.balls >= 6) {
        innings.overs += 1;
        innings.balls = 0;
      }
    }

    innings.runs += totalBallRuns;
    if (isExtra) innings.extras += (extraType === 'Wide' || extraType === 'No Ball' ? 1 : 0);

    if (isWicket) {
      innings.wickets += 1;
    }

    // Batsman stats
    let bStat = innings.batsmen.find(b => b.name === striker);
    if (!bStat) {
      bStat = { name: striker, runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false, dismissalInfo: 'not out' };
      innings.batsmen.push(bStat);
    }
    if (!isExtra || extraType === 'No Ball' || extraType === 'Bye' || extraType === 'Leg Bye') {
      bStat.runs += runsScored;
      if (isLegalBall) bStat.balls += 1;
      if (runsScored === 4 && !isExtra) bStat.fours += 1;
      if (runsScored === 6 && !isExtra) bStat.sixes += 1;
    }

    if (isWicket && dismissedPlayer) {
      const outBat = innings.batsmen.find(b => b.name === dismissedPlayer) || bStat;
      outBat.isOut = true;
      outBat.dismissalInfo = `${wicketType}${fielder ? ' c ' + fielder : ''} b ${bowler}`;
    }

    // Commentary
    const commentary = isWicket
      ? `WICKET! ${dismissedPlayer || striker} ${wicketType} b ${bowler}`
      : runsScored === 6
      ? `SIX! ${striker} smashes ${bowler} over the boundary!`
      : runsScored === 4
      ? `FOUR! ${striker} hits a boundary off ${bowler}`
      : `${runsScored} run(s) scored by ${striker}`;

    innings.ballByBall.push({
      overNum: innings.overs,
      ballNum: innings.balls,
      runs: runsScored,
      isExtra: !!isExtra,
      extraType: extraType || 'None',
      isWicket: !!isWicket,
      wicketType: wicketType || 'None',
      dismissedPlayer: dismissedPlayer || '',
      fielder: fielder || '',
      striker,
      nonStriker: nonStriker || '',
      bowler,
      commentary
    });

    if (match.currentInningsNum === 1) {
      match.ourScore = `${innings.runs}/${innings.wickets} (${innings.overs}.${innings.balls} ov)`;
    } else {
      match.theirScore = `${innings.runs}/${innings.wickets} (${innings.overs}.${innings.balls} ov)`;
    }

    if (mongoose.connection.readyState === 1 && typeof match.save === 'function') {
      await match.save();
    } else {
      memoryMatchesStore[req.params.id] = match;
    }

    res.status(200).json({ success: true, data: match });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to record ball', error: err.message });
  }
};

exports.endFirstInnings = async (req, res) => {
  try {
    let match = memoryMatchesStore[req.params.id];
    if (!match) return res.status(404).json({ success: false, message: 'Match not found' });

    match.currentInningsNum = 2;
    match.target = (match.innings1 ? match.innings1.runs : 180) + 1;
    match.innings2 = {
      battingTeam: match.teamB || 'Australia',
      bowlingTeam: match.teamA || 'India',
      runs: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      extras: 0,
      batsmen: [],
      bowlers: [],
      ballByBall: []
    };

    res.status(200).json({ success: true, message: `2nd Innings started. Target: ${match.target}`, data: match });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.completeLiveMatch = async (req, res) => {
  try {
    const { result, winMargin, manOfTheMatch } = req.body;
    let match = memoryMatchesStore[req.params.id];
    if (match) {
      match.status = 'Completed';
      match.result = result || 'Won';
      match.winMargin = winMargin || 'India won the match';
      match.manOfTheMatch = manOfTheMatch || 'Rohit Sharma';
    }
    res.status(200).json({ success: true, message: 'Match concluded successfully!', data: match });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to complete match', error: err.message });
  }
};
