import {
  boolean,
  decimal,
  index,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

// Import auth_user from auth schema for the foreign key reference
import { auth_user } from './auth-schema';
import { chapters } from './subjects-schema';

// Import related tables will be handled in main schema exports

// Flashcards table - Individual flashcards for spaced repetition
export const flashcards = pgTable('flashcards', {
  id: serial('id').primaryKey(),
  chapterId: integer('chapter_id').notNull().references(() => chapters.id, { onDelete: 'cascade' }),
  front: text('front').notNull(), // Question/term on the front
  back: text('back').notNull(), // Answer/definition on the back
  example: text('example'), // Example usage or context
  imageUrl: text('image_url'), // URL to supporting image
  audioUrl: text('audio_url'), // URL to audio pronunciation
  tags: text('tags').array(), // Tags for categorization
  difficulty: decimal('difficulty', { precision: 3, scale: 2 }).default('0.5'), // 0-1 scale
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, table => ({
  chapterIdx: index('flashcards_chapter_id_idx').on(table.chapterId),
  difficultyIdx: index('flashcards_difficulty_idx').on(table.difficulty),
  tagsIdx: index('flashcards_tags_idx').on(table.tags),
  activeIdx: index('flashcards_active_idx').on(table.isActive),
}));

// User flashcard progress - SM-2 spaced repetition algorithm tracking
export const userFlashcardProgress = pgTable('user_flashcard_progress', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => auth_user.id, { onDelete: 'cascade' }),
  flashcardId: integer('flashcard_id').notNull().references(() => flashcards.id, { onDelete: 'cascade' }),

  // SM-2 Algorithm parameters
  easeFactor: decimal('ease_factor', { precision: 4, scale: 2 }).notNull().default('2.5'), // Starts at 2.5
  interval: integer('interval').notNull().default(1), // Days until next review
  repetitions: integer('repetitions').notNull().default(0), // Number of successful repetitions

  // Scheduling
  nextReviewDate: timestamp('next_review_date').notNull().defaultNow(),
  lastReviewed: timestamp('last_reviewed'),

  // Performance tracking
  totalReviews: integer('total_reviews').notNull().default(0),
  correctReviews: integer('correct_reviews').notNull().default(0),
  averageResponseTime: integer('average_response_time'), // milliseconds

  // Quality distribution (counts of each quality response)
  againCount: integer('again_count').notNull().default(0), // Quality 0-2
  hardCount: integer('hard_count').notNull().default(0), // Quality 3
  goodCount: integer('good_count').notNull().default(0), // Quality 4
  easyCount: integer('easy_count').notNull().default(0), // Quality 5

  // Metadata
  isSuspended: boolean('is_suspended').notNull().default(false), // Temporarily suspended
  isBuried: boolean('is_buried').notNull().default(false), // Until next day
  note: text('note'), // User notes about the card

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
  userIntervalIdx: index('user_flashcard_interval_idx').on(table.userId, table.interval),
  flashcardIdx: index('user_flashcard_flashcard_idx').on(table.flashcardId),
}));

// Flashcard sessions - Study session tracking
export const flashcardSessions = pgTable('flashcard_sessions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => auth_user.id, { onDelete: 'cascade' }),
  chapterId: integer('chapter_id').references(() => chapters.id, { onDelete: 'cascade' }),

  // Session configuration
  sessionType: text('session_type').notNull().default('review'), // 'review', 'learn', 'test'
  maxCards: integer('max_cards'), // Maximum cards for the session
  timeLimit: integer('time_limit'), // Time limit in minutes

  // Session timing
  startedAt: timestamp('started_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
  pausedAt: timestamp('paused_at'),
  totalPausedTime: integer('total_paused_time').notNull().default(0), // milliseconds

  // Session statistics
  totalCards: integer('total_cards').notNull().default(0),
  newCards: integer('new_cards').notNull().default(0),
  learningCards: integer('learning_cards').notNull().default(0),
  reviewCards: integer('review_cards').notNull().default(0),

  // Quality responses (SM-2 algorithm)
  againCount: integer('again_count').notNull().default(0), // Quality 0-2
  hardCount: integer('hard_count').notNull().default(0), // Quality 3
  goodCount: integer('good_count').notNull().default(0), // Quality 4
  easyCount: integer('easy_count').notNull().default(0), // Quality 5

  // Performance metrics
  averageResponseTime: integer('average_response_time'), // milliseconds
  accuracyRate: decimal('accuracy_rate', { precision: 5, scale: 2 }), // percentage

  // Session state
  status: text('status').notNull().default('active'), // 'active', 'completed', 'abandoned'
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
  startedAtIdx: index('flashcard_sessions_started_at_idx').on(table.startedAt),
}));

// Flashcard responses - Individual card responses within sessions
export const flashcardResponses = pgTable('flashcard_responses', {
  id: serial('id').primaryKey(),
  sessionId: text('session_id').notNull().references(() => flashcardSessions.id, { onDelete: 'cascade' }),
  flashcardId: integer('flashcard_id').notNull().references(() => flashcards.id, { onDelete: 'cascade' }),

  // Response details
  quality: integer('quality').notNull(), // 0-5 (SM-2 algorithm: 0-2=again, 3=hard, 4=good, 5=easy)
  responseTime: integer('response_time').notNull(), // milliseconds

  // State before review (for analytics)
  previousInterval: integer('previous_interval'),
  previousEaseFactor: decimal('previous_ease_factor', { precision: 4, scale: 2 }),
  previousRepetitions: integer('previous_repetitions'),

  // State after review (calculated by SM-2 algorithm)
  newInterval: integer('new_interval'),
  newEaseFactor: decimal('new_ease_factor', { precision: 4, scale: 2 }),
  newRepetitions: integer('new_repetitions'),
  nextReviewDate: timestamp('next_review_date'),

  // User interaction
  wasShown: boolean('was_shown').notNull().default(true), // If the card was actually shown
  wasSkipped: boolean('was_skipped').notNull().default(false), // If user skipped the card

  respondedAt: timestamp('responded_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, table => ({
  sessionIdx: index('flashcard_responses_session_idx').on(table.sessionId),
  flashcardIdx: index('flashcard_responses_flashcard_idx').on(table.flashcardId),
  qualityIdx: index('flashcard_responses_quality_idx').on(table.quality),
  respondedAtIdx: index('flashcard_responses_responded_at_idx').on(table.respondedAt),
}));
