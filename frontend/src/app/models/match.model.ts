export interface BallDetail {
  overNum: number;
  ballNum: number;
  runs: number;
  isExtra: boolean;
  extraType?: 'Wide' | 'No Ball' | 'Bye' | 'Leg Bye' | 'None';
  isWicket: boolean;
  wicketType?: 'Bowled' | 'Caught' | 'LBW' | 'Run Out' | 'Stumped' | 'Hit Wicket' | 'None';
  dismissedPlayer?: string;
  fielder?: string;
  striker: string;
  nonStriker?: string;
  bowler: string;
  commentary?: string;
  timestamp?: string;
}

export interface BatsmanPerf {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOut: boolean;
  dismissalInfo: string;
}

export interface BowlerPerf {
  name: string;
  overs: number;
  legalBalls: number;
  maidens: number;
  runs: number;
  wickets: number;
  wides?: number;
  noBalls?: number;
}

export interface InningsDetail {
  battingTeam: string;
  bowlingTeam: string;
  runs: number;
  wickets: number;
  overs: number;
  balls: number;
  extras: number;
  batsmen: BatsmanPerf[];
  bowlers: BowlerPerf[];
  ballByBall: BallDetail[];
}

export interface Match {
  _id?: string;
  opponent: string;
  teamA?: string;
  teamB?: string;
  matchDate: string;
  venue: string;
  matchType: 'T20' | 'ODI' | 'Test' | 'Practice Match' | '10-Over';
  oversLimit?: number;
  tournament?: any;
  tossWinner?: string;
  tossDecision?: 'Batting' | 'Bowling' | '';
  status?: 'Upcoming' | 'Live' | 'Completed' | 'Abandoned';
  result: 'Won' | 'Lost' | 'Draw' | 'Tied' | 'No Result' | 'Upcoming' | 'Live';
  winMargin?: string;
  currentInningsNum?: number;
  target?: number;
  ourScore?: string;
  theirScore?: string;
  manOfTheMatch?: string;
  notes?: string;
  innings1?: InningsDetail;
  innings2?: InningsDetail;
  createdAt?: string;
  updatedAt?: string;
}

export const MATCH_TYPES: string[] = ['T20', 'ODI', 'Test', 'Practice Match', '10-Over'];

export const MATCH_RESULTS: string[] = ['Upcoming', 'Live', 'Won', 'Lost', 'Draw', 'Tied', 'No Result'];
