import { z } from 'zod';

// Progress schemas
export const UserProgressCreateSchema = z.object({
  userId: z.string().min(1, 'L\'ID utilisateur est requis'),
  chapterId: z.number().int().positive('L\'ID du chapitre est requis'),
  masteryPercentage: z.number().min(0).max(100).default(0),
  confidenceLevel: z.number().min(0).max(1).default(0.5),
  isStarted: z.boolean().default(false),
  isCompleted: z.boolean().default(false),
  completedAt: z.string().datetime().optional(),
  lastStudied: z.string().datetime().optional(),
  timeSpentMinutes: z.number().int().min(0).default(0),
  studySessions: z.number().int().min(0).default(0),
  flashcardProgress: z.number().min(0).max(100).default(0),
  quizProgress: z.number().min(0).max(100).default(0),
  practiceProgress: z.number().min(0).max(100).default(0),
  averageQuizScore: z.number().min(0).max(100).optional(),
  bestQuizScore: z.number().min(0).max(100).optional(),
  flashcardRetentionRate: z.number().min(0).max(100).optional(),
  nextReviewDate: z.string().datetime().optional(),
  totalReviews: z.number().int().min(0).default(0),
  correctReviews: z.number().int().min(0).default(0),
  targetMastery: z.number().min(0).max(100).default(80),
  targetCompletionDate: z.string().datetime().optional(),
  currentDifficulty: z.enum(['facile', 'moyen', 'difficile']).default('moyen'),
  adaptiveDifficulty: z.boolean().default(true),
  currentStreak: z.number().int().min(0).default(0),
  longestStreak: z.number().int().min(0).default(0),
  lastStudyDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'La date doit être au format AAAA-MM-JJ').optional(),
  qualityScore: z.number().min(0).max(100).default(0),
  engagementScore: z.number().min(0).max(100).default(0),
  personalNotes: z.string().max(1000, 'Les notes personnelles ne peuvent pas dépasser 1000 caractères').optional(),
  difficultConcepts: z.array(z.string().max(100, 'Chaque concept difficile ne peut pas dépasser 100 caractères')).optional(),
  masteredConcepts: z.array(z.string().max(100, 'Chaque concept maîtrisé ne peut pas dépasser 100 caractères')).optional(),
});

export const UserProgressUpdateSchema = UserProgressCreateSchema.partial();

// Subject progress schemas
export const SubjectProgressCreateSchema = z.object({
  userId: z.string().min(1, 'L\'ID utilisateur est requis'),
  subjectId: z.number().int().positive('L\'ID du sujet est requis'),
  masteryPercentage: z.number().min(0).max(100).default(0),
  confidenceLevel: z.number().min(0).max(1).default(0.5),
  totalChapters: z.number().int().min(0).default(0),
  startedChapters: z.number().int().min(0).default(0),
  completedChapters: z.number().int().min(0).default(0),
  totalStudyTime: z.number().int().min(0).default(0),
  averageSessionTime: z.number().min(0).default(0),
  totalSessions: z.number().int().min(0).default(0),
  overallQuizScore: z.number().min(0).max(100).optional(),
  flashcardRetentionRate: z.number().min(0).max(100).optional(),
  strongestTopics: z.array(z.string().max(100, 'Chaque sujet fort ne peut pas dépasser 100 caractères')).optional(),
  weakestTopics: z.array(z.string().max(100, 'Chaque sujet faible ne peut pas dépasser 100 caractères')).optional(),
  recommendedFocus: z.array(z.string().max(100, 'Chaque recommandation ne peut pas dépasser 100 caractères')).optional(),
  firstStudied: z.string().datetime().optional(),
  lastStudied: z.string().datetime().optional(),
  mostProductiveHour: z.number().int().min(0).max(23).optional(),
  targetMastery: z.number().min(0).max(100).default(80),
  targetCompletionDate: z.string().datetime().optional(),
  isOnTrack: z.boolean().default(true),
  mockTestScores: z.array(z.object({
    date: z.string().datetime(),
    score: z.number().min(0).max(100),
    type: z.string(),
  })).optional(),
  readinessScore: z.number().min(0).max(100).default(0),
});

export const SubjectProgressUpdateSchema = SubjectProgressCreateSchema.partial();

// Study session schemas
export const StudySessionCreateSchema = z.object({
  userId: z.string().min(1, 'L\'ID utilisateur est requis'),
  chapterId: z.number().int().positive('L\'ID du chapitre est requis').optional(),
  sessionType: z.enum(['flashcards', 'quiz', 'reading', 'practice', 'review']).default('review'),
  focusArea: z.string().max(100, 'Le domaine de concentration ne peut pas dépasser 100 caractères').optional(),
  studyMode: z.enum(['focused', 'casual', 'intensive']).default('focused'),
  plannedDuration: z.number().int().min(5).max(480).optional(), // minutes
  device: z.enum(['mobile', 'tablet', 'desktop']).optional(),
  location: z.enum(['home', 'school', 'library', 'other']).optional(),
  timeOfDay: z.enum(['morning', 'afternoon', 'evening', 'night']).optional(),
  topicsCovered: z.array(z.string().max(100, 'Chaque sujet ne peut pas dépasser 100 caractères')).optional(),
  materialsUsed: z.array(z.string().max(50, 'Chaque matériel ne peut pas dépasser 50 caractères')).optional(),
  sessionGoals: z.array(z.object({
    goal: z.string().max(100),
    completed: z.boolean(),
  })).optional(),
  xpEarned: z.number().int().min(0).default(0),
});

export const StudySessionUpdateSchema = z.object({
  endedAt: z.string().datetime().optional(),
  actualDuration: z.number().int().min(0).optional(),
  activities: z.array(z.object({
    type: z.string(),
    duration: z.number().int().min(0),
    details: z.any(),
  })).optional(),
  questionsAnswered: z.number().int().min(0).optional(),
  correctAnswers: z.number().int().min(0).optional(),
  cardsReviewed: z.number().int().min(0).optional(),
  newCardsLearned: z.number().int().min(0).optional(),
  difficultyPerceived: z.enum(['too_easy', 'just_right', 'too_hard']).optional(),
  energyLevel: z.enum(['high', 'medium', 'low']).optional(),
  focusLevel: z.enum(['high', 'medium', 'low']).optional(),
  satisfaction: z.number().int().min(1).max(5).optional(),
  interruptions: z.number().int().min(0).optional(),
  breaks: z.number().int().min(0).optional(),
  totalBreakTime: z.number().int().min(0).optional(),
  achievements: z.array(z.string()).optional(),
  notes: z.string().max(1000).optional(),
  challenges: z.array(z.string().max(200)).optional(),
  insights: z.array(z.string().max(200)).optional(),
  effectivenessScore: z.number().min(0).max(100).optional(),
  retentionPrediction: z.number().min(0).max(100).optional(),
});

// Learning analytics schemas
export const LearningAnalyticsCreateSchema = z.object({
  userId: z.string().min(1, 'L\'ID utilisateur est requis'),
  period: z.enum(['daily', 'weekly', 'monthly']),
  periodStart: z.string().datetime('La date de début de période est requise'),
  periodEnd: z.string().datetime('La date de fin de période est requise'),
  totalStudyTime: z.number().int().min(0).default(0),
  sessionCount: z.number().int().min(0).default(0),
  averageSessionDuration: z.number().min(0).default(0),
  mostActiveHour: z.number().int().min(0).max(23).optional(),
  mostActiveDay: z.number().int().min(0).max(6).optional(),
  chaptersStarted: z.number().int().min(0).default(0),
  chaptersCompleted: z.number().int().min(0).default(0),
  masteryGained: z.number().min(0).max(100).default(0),
  averageQuizScore: z.number().min(0).max(100).optional(),
  flashcardRetentionRate: z.number().min(0).max(100).optional(),
  accuracyRate: z.number().min(0).max(100).optional(),
  activeDays: z.number().int().min(0).default(0),
  streakDays: z.number().int().min(0).default(0),
  consistencyScore: z.number().min(0).max(100).default(0),
  questionsAnswered: z.number().int().min(0).default(0),
  flashcardsReviewed: z.number().int().min(0).default(0),
  hintsUsed: z.number().int().min(0).default(0),
  conceptsLearned: z.number().int().min(0).default(0),
  skillsImproved: z.array(z.string().max(100)).optional(),
  challengesOvercome: z.array(z.string().max(100)).optional(),
  predictedExamScore: z.number().min(0).max(100).optional(),
  completionProbability: z.number().min(0).max(100).optional(),
  recommendedStudyTime: z.number().int().min(0).optional(),
  percentileRank: z.number().min(0).max(100).optional(),
  improvementRate: z.number().min(0).max(100).optional(),
});

export const LearningAnalyticsUpdateSchema = LearningAnalyticsCreateSchema.partial();

// Progress tracking filters
export const ProgressFilterSchema = z.object({
  userId: z.string().optional(),
  chapterId: z.number().int().positive().optional(),
  subjectId: z.number().int().positive().optional(),
  dateRange: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
  }).optional(),
  masteryRange: z.object({
    min: z.number().min(0).max(100).optional(),
    max: z.number().min(0).max(100).optional(),
  }).optional(),
  isCompleted: z.boolean().optional(),
  sessionType: z.enum(['flashcards', 'quiz', 'reading', 'practice', 'review']).optional(),
});

// Study goals schemas
export const StudyGoalCreateSchema = z.object({
  userId: z.string().min(1, 'L\'ID utilisateur est requis'),
  title: z.string().min(1, 'Le titre est requis').max(100),
  description: z.string().max(500).optional(),
  goalType: z.enum(['mastery', 'time', 'streak', 'chapters', 'exam_score']),
  targetValue: z.number().min(0),
  currentValue: z.number().min(0).default(0),
  unit: z.string().max(20).optional(), // '%', 'minutes', 'days', 'chapters', 'points'
  subjectId: z.number().int().positive().optional(),
  chapterId: z.number().int().positive().optional(),
  deadline: z.string().datetime().optional(),
  isActive: z.boolean().default(true),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

export const StudyGoalUpdateSchema = StudyGoalCreateSchema.partial();

// Progress dashboard data
export const ProgressDashboardSchema = z.object({
  overview: z.object({
    totalStudyTime: z.number().int().min(0),
    streakDays: z.number().int().min(0),
    masteryPercentage: z.number().min(0).max(100),
    xpGained: z.number().int().min(0),
    level: z.number().int().min(1),
  }),
  subjects: z.array(z.object({
    subjectId: z.number().int(),
    subjectName: z.string(),
    masteryPercentage: z.number().min(0).max(100),
    studyTime: z.number().int().min(0),
    chaptersCompleted: z.number().int().min(0),
    totalChapters: z.number().int().min(0),
  })),
  recentActivity: z.array(z.object({
    type: z.string(),
    description: z.string(),
    timestamp: z.string().datetime(),
    xpEarned: z.number().int().optional(),
  })),
  upcomingReviews: z.array(z.object({
    chapterId: z.number().int(),
    chapterName: z.string(),
    dueCards: z.number().int().min(0),
    nextReviewDate: z.string().datetime(),
  })),
  achievements: z.array(z.object({
    title: z.string(),
    description: z.string(),
    unlockedAt: z.string().datetime(),
    icon: z.string(),
  })),
});

// Validation functions
export function validateUserProgress(data: unknown) {
  return UserProgressCreateSchema.safeParse(data);
}

export function validateStudySession(data: unknown) {
  return StudySessionCreateSchema.safeParse(data);
}

export function validateLearningAnalytics(data: unknown) {
  return LearningAnalyticsCreateSchema.safeParse(data);
}

export function validateStudyGoal(data: unknown) {
  return StudyGoalCreateSchema.safeParse(data);
}

export function validateProgressFilter(data: unknown) {
  return ProgressFilterSchema.safeParse(data);
}

// Type exports
export type UserProgressCreate = z.infer<typeof UserProgressCreateSchema>;
export type UserProgressUpdate = z.infer<typeof UserProgressUpdateSchema>;
export type SubjectProgressCreate = z.infer<typeof SubjectProgressCreateSchema>;
export type SubjectProgressUpdate = z.infer<typeof SubjectProgressUpdateSchema>;
export type StudySessionCreate = z.infer<typeof StudySessionCreateSchema>;
export type StudySessionUpdate = z.infer<typeof StudySessionUpdateSchema>;
export type LearningAnalyticsCreate = z.infer<typeof LearningAnalyticsCreateSchema>;
export type LearningAnalyticsUpdate = z.infer<typeof LearningAnalyticsUpdateSchema>;
export type ProgressFilter = z.infer<typeof ProgressFilterSchema>;
export type StudyGoalCreate = z.infer<typeof StudyGoalCreateSchema>;
export type StudyGoalUpdate = z.infer<typeof StudyGoalUpdateSchema>;
export type ProgressDashboard = z.infer<typeof ProgressDashboardSchema>;
