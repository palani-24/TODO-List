export interface Player {
  _id?: string;
  name: string;
  role: 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket Keeper' | 'Captain';
  jerseyNumber: number;
  battingStyle: 'Right-Handed' | 'Left-Handed';
  bowlingStyle: 'Right-Arm Fast' | 'Left-Arm Fast' | 'Right-Arm Spin' | 'Left-Arm Spin' | 'N/A';
  phone?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const PLAYER_ROLES: string[] = [
  'Batsman',
  'Bowler',
  'All-Rounder',
  'Wicket Keeper',
  'Captain'
];

export const BATTING_STYLES: string[] = ['Right-Handed', 'Left-Handed'];

export const BOWLING_STYLES: string[] = [
  'Right-Arm Fast',
  'Left-Arm Fast',
  'Right-Arm Spin',
  'Left-Arm Spin',
  'N/A'
];

export interface PlayerStats {
  total: number;
  active: number;
  inactive: number;
  byRole: { _id: string; count: number }[];
}
