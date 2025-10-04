import {
  boolean,
  decimal,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

// Import auth_user from auth schema for the foreign key reference
import { auth_user } from './auth-schema';

// Import subjects and chapters from subjects schema for foreign key references
import { chapters } from './subjects-schema';

// Enums for quiz system
export const questionTypeEnum = pgEnum('question_type', [
  'multiple_choice',
  'true_false',
  'fill_blank',
  'short_answer',
  'essay',
  'matching',
  'ordering',
]);

export const quizDifficultyEnum = pgEnum('quiz_difficulty', ['facile', 'moyen', 'difficile']);
export const quizStatusEnum = pgEnum('quiz_status', ['draft', 'active', 'archived']);

// Quiz questions table - Individual questions for quizzes
export const quizQuestions = pgTable('quiz_questions', {
  id: serial('id').primaryKey(),
  chapterId: integer('chapter_id').notNull().references(() => chapters.id, { onDelete: 'cascade' }),

  // Question content
  type: questionTypeEnum('type').notNull(),
  question: text('question').notNull(),
  imageUrl: text('image_url'),
  audioUrl: text('audio_url'),
  videoUrl: text('video_url'),

  // Question data (JSON structure varies by type)
  options: jsonb('options'), // For multiple choice: ["A", "B", "C", "D"]
  correctAnswer: text('correct_answer').notNull(),
  explanation: text('explanation'), // Detailed explanation of the answer
  hints: text('hints').array(), // Optional hints for students

  // Metadata
  points: integer('points').notNull().default(1),
  difficulty: quizDifficultyEnum('difficulty').notNull().default('moyen'),
  order: integer('order').notNull(),
  tags: text('tags').array(),
  estimatedTime: integer('estimated_time'), // seconds

  // Performance data (calculated from attempts)
  totalAttempts: integer('total_attempts').notNull().default(0),
  correctAttempts: integer('correct_attempts').notNull().default(0),
  averageResponseTime: integer('average_response_time'), // milliseconds

  // Status
  isActive: boolean('is_active').notNull().default(true),
  status: quizStatusEnum('status').notNull().default('active'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, table => ({
  chapterIdx: index('quiz_questions_chapter_id_idx').on(table.chapterId),
  typeIdx: index('quiz_questions_type_idx').on(table.type),
  difficultyIdx: index('quiz_questions_difficulty_idx').on(table.difficulty),
  chapterOrderIdx: index('quiz_questions_chapter_order_idx').on(table.chapterId, table.order),
  activeIdx: index('quiz_questions_active_idx').on(table.isActive),
}));

// Quiz attempts table - Complete quiz sessions
export const quizAttempts = pgTable('quiz_attempts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => auth_user.id, { onDelete: 'cascade' }),
  chapterId: integer('chapter_id').references(() => chapters.id, { onDelete: 'cascade' }),

  // Quiz configuration
  quizType: text('quiz_type').notNull().default('practice'), // 'practice', 'test', 'review'
  questionCount: integer('question_count').notNull(),
  timeLimit: integer('time_limit'), // minutes, null for unlimited
  shuffleQuestions: boolean('shuffle_questions').notNull().default(false),
  shuffleOptions: boolean('shuffle_options').notNull().default(true),

  // Timing
  startedAt: timestamp('started_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
  lastActivityAt: timestamp('last_activity_at').notNull().defaultNow(),

  // Results
  score: decimal('score', { precision: 5, scale: 2 }), // 0-100 percentage
  totalPoints: integer('total_points').notNull().default(0),
  earnedPoints: integer('earned_points').notNull().default(0),
  correctAnswers: integer('correct_answers').notNull().default(0),
  incorrectAnswers: integer('incorrect_answers').notNull().default(0),
  skippedAnswers: integer('skipped_answers').notNull().default(0),

  // Performance metrics
  totalResponseTime: integer('total_response_time').notNull().default(0), // milliseconds
  averageResponseTime: integer('average_response_time'), // milliseconds per question
  accuracyRate: decimal('accuracy_rate', { precision: 5, scale: 2 }), // percentage

  // Status and state
  status: text('status').notNull().default('active'), // 'active', 'completed', 'abandoned', 'paused'
  currentQuestionIndex: integer('current_question_index').notNull().default(0),
  progressPercentage: decimal('progress_percentage', { precision: 5, scale: 2 }).notNull().default('0'),

  // Review data
  reviewMode: boolean('review_mode').notNull().default(false),
  reviewStartedAt: timestamp('review_started_at'),
  reviewCompletedAt: timestamp('review_completed_at'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, table => ({
  userIdx: index('quiz_attempts_user_idx').on(table.userId),
  chapterIdx: index('quiz_attempts_chapter_idx').on(table.chapterId),
  statusIdx: index('quiz_attempts_status_idx').on(table.status),
  startedAtIdx: index('quiz_attempts_started_at_idx').on(table.startedAt),
  scoreIdx: index('quiz_attempts_score_idx').on(table.score),
}));

// Quiz answers table - Individual question responses within attempts
export const quizAnswers = pgTable('quiz_answers', {
  id: serial('id').primaryKey(),
  attemptId: text('attempt_id').notNull().references(() => quizAttempts.id, { onDelete: 'cascade' }),
  questionId: integer('question_id').notNull().references(() => quizQuestions.id, { onDelete: 'cascade' }),

  // Question at time of answer (in case question changes)
  questionSnapshot: text('question_snapshot').notNull(),
  optionsSnapshot: jsonb('options_snapshot'),
  correctAnswerSnapshot: text('correct_answer_snapshot').notNull(),

  // User response
  userAnswer: text('user_answer').notNull(),
  isCorrect: boolean('is_correct').notNull(),
  selectedOptions: text('selected_options').array(), // For multiple choice selections

  // Timing
  questionStartedAt: timestamp('question_started_at').notNull(),
  answeredAt: timestamp('answered_at').notNull(),
  responseTime: integer('response_time').notNull(), // milliseconds

  // User actions
  hintsUsed: integer('hints_used').notNull().default(0),
  wasSkipped: boolean('was_skipped').notNull().default(false),
  wasFlagged: boolean('was_flagged').notNull().default(false),
  attempts: integer('attempts').notNull().default(1), // Number of times answered

  // Review data
  reviewed: boolean('reviewed').notNull().default(false),
  reviewedAt: timestamp('reviewed_at'),
  userNote: text('user_note'), // User's personal notes about the question

  createdAt: timestamp('created_at').defaultNow().notNull(),
}, table => ({
  attemptIdx: index('quiz_answers_attempt_idx').on(table.attemptId),
  questionIdx: index('quiz_answers_question_idx').on(table.questionId),
  correctIdx: index('quiz_answers_correct_idx').on(table.isCorrect),
  answeredAtIdx: index('quiz_answers_answered_at_idx').on(table.answeredAt),
}));

// Quiz templates table - Pre-configured quiz configurations
export const quizTemplates = pgTable('quiz_templates', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  chapterId: integer('chapter_id').references(() => chapters.id, { onDelete: 'cascade' }),

  // Template configuration
  quizType: text('quiz_type').notNull().default('practice'),
  questionCount: integer('question_count').notNull(),
  timeLimit: integer('time_limit'), // minutes
  shuffleQuestions: boolean('shuffle_questions').notNull().default(false),
  shuffleOptions: boolean('shuffle_options').notNull().default(true),

  // Question selection criteria
  difficultyFilter: text('difficulty_filter').array(), // ['facile', 'moyen']
  tagsFilter: text('tags_filter').array(),
  pointsRange: jsonb('points_range'), // { "min": 1, "max": 3 }

  // Passing criteria (for certification quizzes)
  passingScore: decimal('passing_score', { precision: 5, scale: 2 }), // percentage
  maxAttempts: integer('max_attempts'),
  cooldownPeriod: integer('cooldown_period'), // hours between attempts

  // Metadata
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),

  createdBy: text('created_by').references(() => auth_user.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, table => ({
  chapterIdx: index('quiz_templates_chapter_idx').on(table.chapterId),
  activeIdx: index('quiz_templates_active_idx').on(table.isActive),
  sortIdx: index('quiz_templates_sort_idx').on(table.sortOrder),
}));

// User quiz statistics - Aggregated performance data
export const userQuizStatistics = pgTable('user_quiz_statistics', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => auth_user.id, { onDelete: 'cascade' }),
  chapterId: integer('chapter_id').references(() => chapters.id, { onDelete: 'cascade' }),

  // Overall statistics
  totalAttempts: integer('total_attempts').notNull().default(0),
  completedAttempts: integer('completed_attempts').notNull().default(0),
  bestScore: decimal('best_score', { precision: 5, scale: 2 }),
  averageScore: decimal('average_score', { precision: 5, scale: 2 }),
  averageResponseTime: integer('average_response_time'), // milliseconds

  // Question-specific statistics
  totalQuestionsAnswered: integer('total_questions_answered').notNull().default(0),
  correctAnswers: integer('correct_answers').notNull().default(0),
  incorrectAnswers: integer('incorrect_answers').notNull().default(0),
  skippedAnswers: integer('skipped_answers').notNull().default(0),

  // Difficulty breakdown
  easyQuestionsAnswered: integer('easy_questions_answered').notNull().default(0),
  easyCorrectAnswers: integer('easy_correct_answers').notNull().default(0),
  mediumQuestionsAnswered: integer('medium_questions_answered').notNull().default(0),
  mediumCorrectAnswers: integer('medium_correct_answers').notNull().default(0),
  hardQuestionsAnswered: integer('hard_questions_answered').notNull().default(0),
  hardCorrectAnswers: integer('hard_correct_answers').notNull().default(0),

  // Type breakdown
  multipleChoiceAnswered: integer('multiple_choice_answered').notNull().default(0),
  multipleChoiceCorrect: integer('multiple_choice_correct').notNull().default(0),
  trueFalseAnswered: integer('true_false_answered').notNull().default(0),
  trueFalseCorrect: integer('true_false_correct').notNull().default(0),
  fillBlankAnswered: integer('fill_blank_answered').notNull().default(0),
  fillBlankCorrect: integer('fill_blank_correct').notNull().default(0),

  // Mastery indicators
  masteryLevel: decimal('mastery_level', { precision: 5, scale: 2 }).notNull().default('0'), // 0-100
  lastImprovedAt: timestamp('last_improved_at'),
  streakDays: integer('streak_days').notNull().default(0),

  // Study time
  totalStudyTime: integer('total_study_time').notNull().default(0), // milliseconds

  lastQuizAt: timestamp('last_quiz_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, table => ({
  userChapterUnique: primaryKey({
    columns: [table.userId, table.chapterId],
    name: 'user_quiz_statistics_pkey',
  }),
  userIdx: index('user_quiz_statistics_user_idx').on(table.userId),
  chapterIdx: index('user_quiz_statistics_chapter_idx').on(table.chapterId),
  masteryIdx: index('user_quiz_statistics_mastery_idx').on(table.masteryLevel),
  lastQuizIdx: index('user_quiz_statistics_last_quiz_idx').on(table.lastQuizAt),
}));

// Import related tables
export { chapters } from './subjects-schema';
