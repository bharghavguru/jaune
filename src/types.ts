export type LearningCategory =
  | 'Data Structures'
  | 'Java'
  | 'SQL'
  | 'Computer Networks'
  | 'React'
  | 'TypeScript'
  | 'Cloud Computing'
  | 'English'
  | 'System Design'
  | string;

export interface LearningCommit {
  id: string;
  concept: string;
  category: LearningCategory;
  notes?: string;
  timestamp: string; // HH:mm or ISO
  dateString: string; // YYYY-MM-DD
  difficulty?: 'Foundational' | 'Intermediate' | 'Advanced' | 'Quick' | 'Core' | 'Deep Dive';
  tags?: string[];
}

export interface ContributionDay {
  date: string; // YYYY-MM-DD
  dateObj: Date;
  count: number;
  commits: LearningCommit[];
  intensity: 0 | 1 | 2 | 3 | 4 | 5;
  dayOfWeek: number; // 0 (Sun) to 6 (Sat)
  isToday: boolean;
  isFuture: boolean;
  monthName?: string;
}

export interface LearningSpace {
  id: string;
  name: LearningCategory;
  conceptCount: number;
  color: string;
  description: string;
  masteryLevel: string;
  lastActive: string;
  iconName?: string;
  level?: string;
  conceptsLearned?: number;
  totalConceptsGoal?: number;
  tags?: string[];
}

export interface UserStats {
  streakCurrent: number;
  streakLongest: number;
  totalConcepts: number;
  totalContributions: number;
  conceptsThisWeek: number;
  conceptsThisMonth: number;
  mostActiveDay: string;
  consistencyPercentage: number;
}

export interface UserProfile {
  name: string;
  handle: string;
  role: string;
  bio: string;
  avatarUrl: string;
  location: string;
  githubHandle?: string;
  joinedDate: string;
}
