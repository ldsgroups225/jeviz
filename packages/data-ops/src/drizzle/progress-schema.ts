import {
  boolean,
  decimal,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

// Import auth_user from auth schema for the foreign key reference
import { auth_user } from './auth-schema';

// Import subjects and chapters from subjects schema for foreign key references
import { chapters, subjects } from './subjects-schema';

// User progress table - Overall chapter/subject mastery tracking
export const userProgress = pgTable('user_progress', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => auth_user.id, { onDelete: 'cascade' }),
  chapterId: integer('chapter_id').notNull().references(() => chapters.id, { onDelete: 'cascade' }),

  // Mastery metrics
  masteryPercentage: decimal('mastery_percentage', { precision: 5, scale: 2 }).notNull().default('0'), // 0-100
  confidenceLevel: decimal('confidence_level', { precision: 3, scale: 2 }).notNull().default('0.5'), // 0-1

  // Completion status
  isStarted: boolean('is_started').notNull().default(false),
  isCompleted: boolean('is_completed').notNull().default(false),
  completedAt: timestamp('completed_at'),

  // Study activity
  lastStudied: timestamp('last_studied'),
  timeSpentMinutes: integer('time_spent_minutes').notNull().default(0),
  studySessions: integer('study_sessions').notNull().default(0),

  // Component progress (detailed breakdown)
  flashcardProgress: decimal('flashcard_progress', { precision: 5, scale: 2 }).notNull().default('0'), // 0-100
  quizProgress: decimal('quiz_progress', { precision: 5, scale: 2 }).notNull().default('0'), // 0-100
  practiceProgress: decimal('practice_progress', { precision: 5, scale: 2 }).notNull().default('0'), // 0-100

  // Performance metrics
  averageQuizScore: decimal('average_quiz_score', { precision: 5, scale: 2 }),
  bestQuizScore: decimal('best_quiz_score', { precision: 5, scale: 2 }),
  flashcardRetentionRate: decimal('flashcard_retention_rate', { precision: 5, scale: 2 }), // 0-100

  // Spaced repetition data
  nextReviewDate: timestamp('next_review_date'),
  totalReviews: integer('total_reviews').notNull().default(0),
  correctReviews: integer('correct_reviews').notNull().default(0),

  // Goals and milestones
  targetMastery: decimal('target_mastery', { precision: 5, scale: 2 }).notNull().default('80'), // 0-100
  targetCompletionDate: timestamp('target_completion_date'),
  milestones: jsonb('milestones'), // Array of completed milestones with dates

  // Difficulty adaptation
  currentDifficulty: text('current_difficulty').notNull().default('moyen'), // 'facile', 'moyen', 'difficile'
  adaptiveDifficulty: boolean('adaptive_difficulty').notNull().default(true),

  // Streaks and consistency
  currentStreak: integer('current_streak').notNull().default(0), // consecutive days
  longestStreak: integer('longest_streak').notNull().default(0),
  lastStudyDate: text('last_study_date'), // YYYY-MM-DD

  // Quality indicators
  qualityScore: decimal('quality_score', { precision: 5, scale: 2 }).notNull().default('0'), // 0-100 based on response quality
  engagementScore: decimal('engagement_score', { precision: 5, scale: 2 }).notNull().default('0'), // 0-100 based on activity

  // Notes and reflections
  personalNotes: text('personal_notes'),
  difficultConcepts: text('difficult_concepts').array(),
  masteredConcepts: text('mastered_concepts').array(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, table => ({
  userChapterUnique: primaryKey({
    columns: [table.userId, table.chapterId],
    name: 'user_progress_pkey',
  }),
  userIdx: index('user_progress_user_idx').on(table.userId),
  chapterIdx: index('user_progress_chapter_idx').on(table.chapterId),
  masteryIdx: index('user_progress_mastery_idx').on(table.masteryPercentage),
  completedIdx: index('user_progress_completed_idx').on(table.isCompleted),
  lastStudiedIdx: index('user_progress_last_studied_idx').on(table.lastStudied),
  nextReviewIdx: index('user_progress_next_review_idx').on(table.nextReviewDate),
}));

// Subject progress table - Aggregated progress at subject level
export const subjectProgress = pgTable('subject_progress', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => auth_user.id, { onDelete: 'cascade' }),
  subjectId: integer('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),

  // Overall subject mastery
  masteryPercentage: decimal('mastery_percentage', { precision: 5, scale: 2 }).notNull().default('0'),
  confidenceLevel: decimal('confidence_level', { precision: 3, scale: 2 }).notNull().default('0.5'),

  // Chapter breakdown
  totalChapters: integer('total_chapters').notNull().default(0),
  startedChapters: integer('started_chapters').notNull().default(0),
  completedChapters: integer('completed_chapters').notNull().default(0),

  // Study metrics
  totalStudyTime: integer('total_study_time').notNull().default(0), // minutes
  averageSessionTime: decimal('average_session_time', { precision: 6, scale: 2 }).notNull().default('0'), // minutes
  totalSessions: integer('total_sessions').notNull().default(0),

  // Performance by component
  overallQuizScore: decimal('overall_quiz_score', { precision: 5, scale: 2 }),
  flashcardRetentionRate: decimal('flashcard_retention_rate', { precision: 5, scale: 2 }),

  // Strengths and weaknesses
  strongestTopics: text('strongest_topics').array(),
  weakestTopics: text('weakest_topics').array(),
  recommendedFocus: text('recommended_focus').array(),

  // Progress timeline
  firstStudied: timestamp('first_studied'),
  lastStudied: timestamp('last_studied'),
  mostProductiveHour: integer('most_productive_hour'), // 0-23 hour of day

  // Goals
  targetMastery: decimal('target_mastery', { precision: 5, scale: 2 }).notNull().default('80'),
  targetCompletionDate: timestamp('target_completion_date'),
  isOnTrack: boolean('is_on_track').notNull().default(true),

  // Exam preparation
  mockTestScores: jsonb('mock_test_scores'), // Array of { date, score, type }
  readinessScore: decimal('readiness_score', { precision: 5, scale: 2 }).notNull().default('0'), // 0-100

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, table => ({
  userSubjectUnique: primaryKey({
    columns: [table.userId, table.subjectId],
    name: 'subject_progress_pkey',
  }),
  userIdx: index('subject_progress_user_idx').on(table.userId),
  subjectIdx: index('subject_progress_subject_idx').on(table.subjectId),
  masteryIdx: index('subject_progress_mastery_idx').on(table.masteryPercentage),
  readinessIdx: index('subject_progress_readiness_idx').on(table.readinessScore),
}));

// Study sessions table - Detailed logging of all study activities
export const studySessions = pgTable('study_sessions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => auth_user.id, { onDelete: 'cascade' }),
  chapterId: integer('chapter_id').references(() => chapters.id, { onDelete: 'cascade' }),

  // Session type and focus
  sessionType: text('session_type').notNull(), // 'flashcards', 'quiz', 'reading', 'practice', 'review'
  focusArea: text('focus_area'), // Specific topic or skill focus
  studyMode: text('study_mode').notNull().default('focused'), // 'focused', 'casual', 'intensive'

  // Timing
  startedAt: timestamp('started_at').notNull().defaultNow(),
  endedAt: timestamp('ended_at'),
  plannedDuration: integer('planned_duration'), // minutes
  actualDuration: integer('actual_duration'), // minutes (calculated)

  // Environment and context
  device: text('device'), // 'mobile', 'tablet', 'desktop'
  location: text('location'), // 'home', 'school', 'library', 'other'
  timeOfDay: text('time_of_day'), // 'morning', 'afternoon', 'evening', 'night'

  // Session content
  activities: jsonb('activities'), // Array of { type, duration, details }
  materialsUsed: text('materials_used').array(), // ['flashcards', 'notes', 'videos']
  topicsCovered: text('topics_covered').array(),

  // Performance and outcomes
  questionsAnswered: integer('questions_answered').notNull().default(0),
  correctAnswers: integer('correct_answers').notNull().default(0),
  cardsReviewed: integer('cards_reviewed').notNull().default(0),
  newCardsLearned: integer('new_cards_learned').notNull().default(0),

  // User experience
  difficultyPerceived: text('difficulty_perceived'), // 'too_easy', 'just_right', 'too_hard'
  energyLevel: text('energy_level'), // 'high', 'medium', 'low'
  focusLevel: text('focus_level'), // 'high', 'medium', 'low'
  satisfaction: integer('satisfaction'), // 1-5 rating

  // Interruptions and breaks
  interruptions: integer('interruptions').notNull().default(0),
  breaks: integer('breaks').notNull().default(0),
  totalBreakTime: integer('total_break_time').notNull().default(0), // minutes

  // Goals and achievements
  sessionGoals: jsonb('session_goals'), // Array of { goal, completed }
  achievements: text('achievements').array(), // Unlocked achievements during session
  xpEarned: integer('xp_earned').notNull().default(0),

  // Reflections
  notes: text('notes'), // User's reflections on the session
  challenges: text('challenges').array(),
  insights: text('insights').array(),

  // Quality metrics
  effectivenessScore: decimal('effectiveness_score', { precision: 5, scale: 2 }), // 0-100
  retentionPrediction: decimal('retention_prediction', { precision: 5, scale: 2 }), // 0-100

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, table => ({
  userIdx: index('study_sessions_user_idx').on(table.userId),
  chapterIdx: index('study_sessions_chapter_idx').on(table.chapterId),
  sessionTypeIdx: index('study_sessions_session_type_idx').on(table.sessionType),
  startedAtIdx: index('study_sessions_started_at_idx').on(table.startedAt),
  actualDurationIdx: index('study_sessions_actual_duration_idx').on(table.actualDuration),
}));

// Learning analytics table - Computed analytics for insights
export const learningAnalytics = pgTable('learning_analytics', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => auth_user.id, { onDelete: 'cascade' }),

  // Analytics period
  period: text('period').notNull(), // 'daily', 'weekly', 'monthly'
  periodStart: timestamp('period_start').notNull(),
  periodEnd: timestamp('period_end').notNull(),

  // Study patterns
  totalStudyTime: integer('total_study_time').notNull().default(0), // minutes
  sessionCount: integer('session_count').notNull().default(0),
  averageSessionDuration: decimal('average_session_duration', { precision: 6, scale: 2 }).notNull().default('0'),
  mostActiveHour: integer('most_active_hour'), // 0-23
  mostActiveDay: integer('most_active_day'), // 0-6 (Sunday=0)

  // Progress metrics
  chaptersStarted: integer('chapters_started').notNull().default(0),
  chaptersCompleted: integer('chapters_completed').notNull().default(0),
  masteryGained: decimal('mastery_gained', { precision: 5, scale: 2 }).notNull().default('0'),

  // Performance metrics
  averageQuizScore: decimal('average_quiz_score', { precision: 5, scale: 2 }),
  flashcardRetentionRate: decimal('flashcard_retention_rate', { precision: 5, scale: 2 }),
  accuracyRate: decimal('accuracy_rate', { precision: 5, scale: 2 }),

  // Engagement and consistency
  activeDays: integer('active_days').notNull().default(0),
  streakDays: integer('streak_days').notNull().default(0),
  consistencyScore: decimal('consistency_score', { precision: 5, scale: 2 }).notNull().default('0'),

  // Content interaction
  questionsAnswered: integer('questions_answered').notNull().default(0),
  flashcardsReviewed: integer('flashcards_reviewed').notNull().default(0),
  hintsUsed: integer('hints_used').notNull().default(0),

  // Learning outcomes
  conceptsLearned: integer('concepts_learned').notNull().default(0),
  skillsImproved: text('skills_improved').array(),
  challengesOvercome: text('challenges_overcome').array(),

  // Predictive analytics
  predictedExamScore: decimal('predicted_exam_score', { precision: 5, scale: 2 }),
  completionProbability: decimal('completion_probability', { precision: 5, scale: 2 }), // 0-100
  recommendedStudyTime: integer('recommended_study_time'), // minutes for next period

  // Comparative metrics
  percentileRank: decimal('percentile_rank', { precision: 5, scale: 2 }), // Among all users
  improvementRate: decimal('improvement_rate', { precision: 5, scale: 2 }), // Rate of improvement

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, table => ({
  userPeriodUnique: primaryKey({
    columns: [table.userId, table.period, table.periodStart],
    name: 'learning_analytics_pkey',
  }),
  userIdx: index('learning_analytics_user_idx').on(table.userId),
  periodIdx: index('learning_analytics_period_idx').on(table.period),
  periodStartIdx: index('learning_analytics_period_start_idx').on(table.periodStart),
  masteryIdx: index('learning_analytics_mastery_gained_idx').on(table.masteryGained),
}));

// Import related tables
export { chapters, subjects } from './subjects-schema';
