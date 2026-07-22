export interface PointsTableEntry {
  teamName: string;
  played: number;
  won: number;
  lost: number;
  tied: number;
  noResult: number;
  points: number;
  nrr: number;
  runsScored?: number;
  oversFaced?: number;
  runsConceded?: number;
  oversBowled?: number;
}

export interface Tournament {
  _id?: string;
  name: string;
  season: string;
  format: 'T20' | 'ODI' | 'Test' | '10-Over' | 'Box Cricket';
  venue: string;
  startDate?: string;
  endDate?: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  teams: string[];
  pointsTable?: PointsTableEntry[];
  createdAt?: string;
}
