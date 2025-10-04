// Combined schema file to avoid circular dependencies
import {
  boolean,
  decimal,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

// Import auth schema
import { auth_user } from './auth-schema';

// Enums
export const gradeEnum = pgEnum('grade', ['3ème', 'Terminale']);
export const seriesEnum = pgEnum('series', ['A', 'C', 'D', 'E', 'G']);
export const examFormatEnum = pgEnum('exam_format', ['écrit', 'pratique', 'oral']);
export const difficultyEnum = pgEnum('difficulty', ['facile', 'moyen', 'difficile']);

// Subjects table
export const subjects = pgTable('subjects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  shortName: text('short_name').notNull(),
  grade: gradeEnum('grade').notNull(),
  series: text('series').array(),
  coefficient: integer('coefficient').notNull(),
  examDuration: integer('exam_duration').notNull(),
  examFormat: examFormatEnum('exam_format').notNull().default('écrit'),
  isCore: boolean('is_core').notNull().default(false),
  languageChoice: boolean('language_choice').notNull().default(false),
  mutualExclusiveWith: integer('mutual_exclusive_with'),
  description: text('description'),
  color: text('color').default('#3B82F6'),
  icon: text('icon'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, table => ({
  gradeIdx: index('subjects_grade_idx').on(table.grade),
  shortNameIdx: index('subjects_short_name_idx').on(table.shortName),
}));

// Chapters table
export const chapters = pgTable('chapters', {
  id: serial('id').primaryKey(),
  subjectId: integer('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  order: integer('order').notNull(),
  estimatedHours: decimal('estimated_hours', { precision: 4, scale: 1 }).default('1'),
  difficulty: difficultyEnum('difficulty').notNull().default('moyen'),
  objectives: text('objectives').array(),
  prerequisites: text('prerequisites').array(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, table => ({
  subjectIdx: index('chapters_subject_id_idx').on(table.subjectId),
  subjectOrderIdx: index('chapters_subject_order_idx').on(table.subjectId, table.order),
}));

// User profiles table
export const userProfiles = pgTable('user_profiles', {
  userId: text('user_id').primaryKey().references(() => auth_user.id, { onDelete: 'cascade' }),
  grade: gradeEnum('grade').notNull(),
  series: seriesEnum('series'),
  secondLanguage: text('second_language'),
  school: text('school'),
  region: text('region'),
  examDate: text('exam_date'),
  studyGoal: text('study_goal'),
  dailyStudyTime: integer('daily_study_time').default(60),
  preferredStudyTime: text('preferred_study_time'),
  studyStreak: integer('study_streak').default(0),
  lastStudyDate: text('last_study_date'),
  totalXP: integer('total_xp').default(0),
  level: integer('level').default(1),
  currentXP: integer('current_xp').default(0),
  onboardingComplete: boolean('onboarding_complete').notNull().default(false),
  notificationsEnabled: boolean('notifications_enabled').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, table => ({
  gradeIdx: index('user_profiles_grade_idx').on(table.grade),
  seriesIdx: index('user_profiles_series_idx').on(table.series),
  streakIdx: index('user_profiles_streak_idx').on(table.studyStreak),
  xpIdx: index('user_profiles_xp_idx').on(table.totalXP),
}));

// Flashcards table
export const flashcards = pgTable('flashcards', {
  id: serial('id').primaryKey(),
  chapterId: integer('chapter_id').notNull().references(() => chapters.id, { onDelete: 'cascade' }),
  front: text('front').notNull(),
  back: text('back').notNull(),
  example: text('example'),
  imageUrl: text('image_url'),
  audioUrl: text('audio_url'),
  tags: text('tags').array(),
  difficulty: decimal('difficulty', { precision: 3, scale: 2 }).default('0.5'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, table => ({
  chapterIdx: index('flashcards_chapter_id_idx').on(table.chapterId),
  difficultyIdx: index('flashcards_difficulty_idx').on(table.difficulty),
  activeIdx: index('flashcards_active_idx').on(table.isActive),
}));

// User flashcard progress table
export const userFlashcardProgress = pgTable('user_flashcard_progress', {
  userId: text('user_id').notNull().references(() => auth_user.id, { onDelete: 'cascade' }),
  flashcardId: integer('flashcard_id').notNull().references(() => flashcards.id, { onDelete: 'cascade' }),
  easeFactor: decimal('ease_factor', { precision: 4, scale: 2 }).notNull().default('2.5'),
  interval: integer('interval').notNull().default(1),
  repetitions: integer('repetitions').notNull().default(0),
  nextReviewDate: timestamp('next_review_date').notNull().defaultNow(),
  lastReviewed: timestamp('last_reviewed'),
  totalReviews: integer('total_reviews').notNull().default(0),
  correctReviews: integer('correct_reviews').notNull().default(0),
  averageResponseTime: integer('average_response_time'),
  againCount: integer('again_count').notNull().default(0),
  hardCount: integer('hard_count').notNull().default(0),
  goodCount: integer('good_count').notNull().default(0),
  easyCount: integer('easy_count').notNull().default(0),
  isSuspended: boolean('is_suspended').notNull().default(false),
  isBuried: boolean('is_buried').notNull().default(false),
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, table => ({
  userFlashcardUnique: primaryKey({
    columns: [table.userId, table.flashcardId],
    name: 'user_flashcard_progress_pkey',
  }),
  userNextReviewIdx: index('user_flashcard_next_review_idx').on(table.userId, table.nextReviewDate),
}));

// Flashcard sessions table
export const flashcardSessions = pgTable('flashcard_sessions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => auth_user.id, { onDelete: 'cascade' }),
  chapterId: integer('chapter_id').references(() => chapters.id, { onDelete: 'cascade' }),
  sessionType: text('session_type').notNull().default('review'),
  maxCards: integer('max_cards'),
  timeLimit: integer('time_limit'),
  startedAt: timestamp('started_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
  pausedAt: timestamp('paused_at'),
  totalPausedTime: integer('total_paused_time').notNull().default(0),
  totalCards: integer('total_cards').notNull().default(0),
  newCards: integer('new_cards').notNull().default(0),
  learningCards: integer('learning_cards').notNull().default(0),
  reviewCards: integer('review_cards').notNull().default(0),
  againCount: integer('again_count').notNull().default(0),
  hardCount: integer('hard_count').notNull().default(0),
  goodCount: integer('good_count').notNull().default(0),
  easyCount: integer('easy_count').notNull().default(0),
  averageResponseTime: integer('average_response_time'),
  accuracyRate: decimal('accuracy_rate', { precision: 5, scale: 2 }),
  status: text('status').notNull().default('active'),
  currentCardIndex: integer('current_card_index').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, table => ({
  userIdx: index('flashcard_sessions_user_idx').on(table.userId),
  chapterIdx: index('flashcard_sessions_chapter_idx').on(table.chapterId),
  statusIdx: index('flashcard_sessions_status_idx').on(table.status),
}));

// Flashcard responses table
export const flashcardResponses = pgTable('flashcard_responses', {
  id: serial('id').primaryKey(),
  sessionId: text('session_id').notNull().references(() => flashcardSessions.id, { onDelete: 'cascade' }),
  flashcardId: integer('flashcard_id').notNull().references(() => flashcards.id, { onDelete: 'cascade' }),
  quality: integer('quality').notNull(),
  responseTime: integer('response_time').notNull(),
  previousInterval: integer('previous_interval'),
  previousEaseFactor: decimal('previous_ease_factor', { precision: 4, scale: 2 }),
  previousRepetitions: integer('previous_repetitions'),
  newInterval: integer('new_interval'),
  newEaseFactor: decimal('new_ease_factor', { precision: 4, scale: 2 }),
  newRepetitions: integer('new_repetitions'),
  nextReviewDate: timestamp('next_review_date'),
  wasShown: boolean('was_shown').notNull().default(true),
  wasSkipped: boolean('was_skipped').notNull().default(false),
  respondedAt: timestamp('responded_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, table => ({
  sessionIdx: index('flashcard_responses_session_idx').on(table.sessionId),
  flashcardIdx: index('flashcard_responses_flashcard_idx').on(table.flashcardId),
  qualityIdx: index('flashcard_responses_quality_idx').on(table.quality),
}));

// User progress table
export const userProgress = pgTable('user_progress', {
  userId: text('user_id').notNull().references(() => auth_user.id, { onDelete: 'cascade' }),
  chapterId: integer('chapter_id').notNull().references(() => chapters.id, { onDelete: 'cascade' }),
  masteryPercentage: decimal('mastery_percentage', { precision: 5, scale: 2 }).notNull().default('0'),
  confidenceLevel: decimal('confidence_level', { precision: 3, scale: 2 }).notNull().default('0.5'),
  isStarted: boolean('is_started').notNull().default(false),
  isCompleted: boolean('is_completed').notNull().default(false),
  completedAt: timestamp('completed_at'),
  lastStudied: timestamp('last_studied'),
  timeSpentMinutes: integer('time_spent_minutes').notNull().default(0),
  studySessions: integer('study_sessions').notNull().default(0),
  flashcardProgress: decimal('flashcard_progress', { precision: 5, scale: 2 }).notNull().default('0'),
  quizProgress: decimal('quiz_progress', { precision: 5, scale: 2 }).notNull().default('0'),
  practiceProgress: decimal('practice_progress', { precision: 5, scale: 2 }).notNull().default('0'),
  averageQuizScore: decimal('average_quiz_score', { precision: 5, scale: 2 }),
  bestQuizScore: decimal('best_quiz_score', { precision: 5, scale: 2 }),
  flashcardRetentionRate: decimal('flashcard_retention_rate', { precision: 5, scale: 2 }),
  nextReviewDate: timestamp('next_review_date'),
  totalReviews: integer('total_reviews').notNull().default(0),
  correctReviews: integer('correct_reviews').notNull().default(0),
  targetMastery: decimal('target_mastery', { precision: 5, scale: 2 }).notNull().default('80'),
  targetCompletionDate: timestamp('target_completion_date'),
  currentDifficulty: text('current_difficulty').notNull().default('moyen'),
  adaptiveDifficulty: boolean('adaptive_difficulty').notNull().default(true),
  currentStreak: integer('current_streak').notNull().default(0),
  longestStreak: integer('longest_streak').notNull().default(0),
  lastStudyDate: text('last_study_date'),
  qualityScore: decimal('quality_score', { precision: 5, scale: 2 }).notNull().default('0'),
  engagementScore: decimal('engagement_score', { precision: 5, scale: 2 }).notNull().default('0'),
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
}));

// Export all tables for use in other files
export { auth_user };
