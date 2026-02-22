export type DayType = 'RUGBY' | 'NO_RUGBY' | 'SATURDAY' | 'SUNDAY';

export interface Meal {
  id: string;
  time: string;
  name: string;
  description: string;
  kcal: number;
  protein?: number;
  isQuickCarb?: boolean;
}

export interface Exercise {
  name: string;
  sets?: string;
}

export interface Activity {
  id: string;
  time: string;
  name: string;
  duration?: string;
  exercises: Exercise[];
}

export interface DailyPlan {
  nutrition: Meal[];
  activity: Activity[];
}

export interface ProgressItem {
  item_id: string;
  type: 'nutrition' | 'activity';
}
