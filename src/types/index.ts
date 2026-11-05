export interface Lesson {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
  notes?: string;
  hasGaps?: boolean;
  missingItems?: string;
  masteryLevel?: 'mastered' | 'needs_revision' | 'unreviewed';
}

export interface Unit {
  id: string;
  name: string;
  lessons: Lesson[];
}

export interface Book {
  id: string;
  name: string;
  units: Unit[];
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  books: Book[];
}

export interface StudyDates {
  start: string;
  end: string;
}

export interface StudySettings {
  dailyTarget: number;
  pomodoroWorkMinutes: number;
  pomodoroBreakMinutes: number;
  soundEnabled: boolean;
}

export interface FlattenedLesson {
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  bookId: string;
  bookName: string;
  unitId: string;
  unitName: string;
  lessonId: string;
  lessonTitle: string;
  completed: boolean;
  completedAt?: string;
  hasGaps?: boolean;
  missingItems?: string;
  masteryLevel?: 'mastered' | 'needs_revision' | 'unreviewed';
}

export interface PlanStats {
  totalLessons: number;
  completedLessons: number;
  remainingLessons: number;
  completionPercentage: number;
  daysRemaining: number;
  totalDays: number;
  daysElapsed: number;
  requiredDailyRate: number;
  targetDailyRate: number;
  completedToday: number;
  todayTargetMet: boolean;
  todayRequiredToFinishOnTime: number;
}

export interface RewardItem {
  id: string;
  title: string;
  cost: number;
  icon: string;
  category: 'fitness' | 'entertainment' | 'treat' | 'custom';
  timesRedeemed: number;
  isGym?: boolean;
}

export interface RedemptionRecord {
  id: string;
  rewardId: string;
  rewardTitle: string;
  cost: number;
  date: string;
  icon: string;
  isGym?: boolean;
  memeQuote?: string;
}

export interface StudentProfile {
  name: string;
  avatarUrl: string;
  points: number;
  totalPointsEarned: number;
  shaterBonusCount: number;
  penaltyCount: number;
  gymVisitsCount: number;
  theme: ThemeColor;
  lastTargetEvaluationDate?: string;
  redeemHistory?: RedemptionRecord[];
}

export type ThemeColor = 'navy' | 'emerald' | 'indigo' | 'charcoal';

export interface MotivationQuote {
  id: string;
  text: string;
  author: string;
  category: string;
}

export interface EgyptianMeme {
  id: string;
  title: string;
  character: string;
  tagline: string;
  avatarUrl: string;
  reactionImageUrl?: string;
  joyText: string;
}
