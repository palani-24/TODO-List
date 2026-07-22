export interface OrangeCapPlayer {
  _id: string;
  name: string;
  role: string;
  jerseyNumber: number;
  runs: number;
  innings: number;
  highestScore: number;
  average: string;
  strikeRate: string;
  fours: number;
  sixes: number;
  fifties: number;
  hundreds: number;
}

export interface PurpleCapPlayer {
  _id: string;
  name: string;
  role: string;
  jerseyNumber: number;
  wickets: number;
  overs: number;
  runsConceded: number;
  economy: string;
  bestBowling: string;
}

export interface SixesKingPlayer {
  _id: string;
  name: string;
  sixes: number;
  fours: number;
  runs: number;
}

export interface LeaderboardsData {
  orangeCap: OrangeCapPlayer[];
  purpleCap: PurpleCapPlayer[];
  sixesKings: SixesKingPlayer[];
}
