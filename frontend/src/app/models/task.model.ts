import { Player } from './player.model';

export interface TaskNote {
  _id?: string;
  text: string;
  author: string;
  createdAt?: string;
}

export interface Task {
  _id?: string;
  taskName: string;
  category: string;
  assignedTo: string;
  player?: Player | string;
  priority: 'High' | 'Medium' | 'Low';
  practiceDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  description?: string;
  tags?: string[];
  notes?: TaskNote[];
  createdAt?: string;
  updatedAt?: string;
}

export const CATEGORY_OPTIONS: string[] = [
  'Batting Practice',
  'Bowling Practice',
  'Fielding Practice',
  'Fitness Training',
  'Match Strategy',
  'Warm-up',
  'Recovery',
  'Team Meeting',
  'Video Analysis',
  'Travel',
  'Equipment Check'
];

export const ASSIGNED_TO_OPTIONS: string[] = [
  'Opening Batsmen',
  'Middle Order',
  'Finishers',
  'Fast Bowlers',
  'Spin Bowlers',
  'Fielders',
  'Wicket Keeper',
  'Captain',
  'Coach',
  'Entire Team'
];

export const PRIORITY_OPTIONS: string[] = ['High', 'Medium', 'Low'];

export const STATUS_OPTIONS: string[] = ['Pending', 'In Progress', 'Completed'];

export interface WeeklyTrendItem {
  date: string;
  day: string;
  completed: number;
}

export interface WorkloadItem {
  _id: string;
  count: number;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress?: number;
  completed: number;
  highPriority: number;
  overdue?: number;
  weeklyTrend?: WeeklyTrendItem[];
  workload?: WorkloadItem[];
}
