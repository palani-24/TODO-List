export interface Task {
  _id?: string;
  taskName: string;
  category: string;
  assignedTo: string;
  priority: 'High' | 'Medium' | 'Low';
  practiceDate: string;
  status: 'Pending' | 'Completed';
  description?: string;
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

export const STATUS_OPTIONS: string[] = ['Pending', 'Completed'];

export interface TaskStats {
  total: number;
  pending: number;
  completed: number;
  highPriority: number;
}
