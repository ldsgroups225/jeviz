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
import { subjects } from './subjects-schema';

// Enums for gamification system
export const achievementTypeEnum = pgEnum('achievement_type', [
  'study_streak',
  'subject_mastery',
  'quiz_score',
  'flashcard_mastery',
  'social',
  'milestone',
  'special',
  'time_based',
  'consistency',
  'improvement',
]);

export const achievementRarityEnum = pgEnum('achievement_rarity', [
  'common',
  'uncommon',
  'rare',
  'epic',
  'legendary',
]);

export const xpSourceEnum = pgEnum('xp_source', [
  'flashcard_review',
  'quiz_completion',
  'chapter_completion',
  'study_session',
  'group_participation',
  'achievement_unlock',
  'daily_login',
  'helping_others',
  'bonus',
]);

export const levelTierEnum = pgEnum('level_tier', [
  'beginner',
  'intermediate',
  'advanced',
  'expert',
  'master',
]);

// Achievements table - Define all possible achievements
export const achievements = pgTable('achievements', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  shortDescription: text('short_description').notNull(),

  // Visual design
  icon: text('icon').notNull(), // Emoji or icon name
  badgeColor: text('badge_color').default('#3B82F6'),
  rarity: achievementRarityEnum('rarity').notNull().default('common'),

  // Achievement classification
  type: achievementTypeEnum('type').notNull(),
  category: text('category'), // 'study', 'social', 'performance', etc.
  subjectId: integer('subject_id').references(() => subjects.id, { onDelete: 'set null' }), // null for general achievements

  // Requirements (JSON structure varies by type)
  requirement: jsonb('requirement').notNull(), // { streak: 7, score: 90, chapters: 5 }
  requirementDescription: text('requirement_description').notNull(),

  // Rewards
  xpReward: integer('xp_reward').notNull().default(10),
  badgeReward: text('badge_reward'), // Special badge for rare achievements
  titleReward: text('title_reward'), // Special user title

  // Availability and conditions
  isActive: boolean('is_active').notNull().default(true),
  isHidden: boolean('is_hidden').notNull().default(false), // Secret achievements
  isRepeatable: boolean('is_repeatable').notNull().default(false),
  maxCompletions: integer('max_completions'), // For repeatable achievements

  // Time constraints
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'), // Limited time achievements
  seasonal: boolean('seasonal').notNull().default(false),

  // Prerequisites
  prerequisiteIds: integer('prerequisite_ids').array(), // Other achievements needed first
  minimumLevel: integer('minimum_level').notNull().default(1),

  // Progress tracking
  isProgressive: boolean('is_progressive').notNull().default(false), // Shows progress bar
  progressSteps: integer('progress_steps'), // Number of steps for progressive achievements

  // Metadata
  sortOrder: integer('sort_order').notNull().default(0),
  createdBy: text('created_by').references(() => auth_user.id),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, table => ({
  typeIdx: index('achievements_type_idx').on(table.type),
  rarityIdx: index('achievements_rarity_idx').on(table.rarity),
  categoryIdx: index('achievements_category_idx').on(table.category),
  subjectIdx: index('achievements_subject_id_idx').on(table.subjectId),
  activeIdx: index('achievements_active_idx').on(table.isActive),
  hiddenIdx: index('achievements_hidden_idx').on(table.isHidden),
  seasonalIdx: index('achievements_seasonal_idx').on(table.seasonal),
}));

// User achievements table - Track which achievements users have unlocked
export const userAchievements = pgTable('user_achievements', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => auth_user.id, { onDelete: 'cascade' }),
  achievementId: integer('achievement_id').notNull().references(() => achievements.id, { onDelete: 'cascade' }),

  // Unlock details
  unlockedAt: timestamp('unlocked_at').notNull().defaultNow(),
  progress: decimal('progress', { precision: 5, scale: 2 }).notNull().default('100'), // 0-100

  // Context of unlock
  unlockContext: jsonb('unlock_context'), // Additional context when unlocked
  unlockValue: text('unlock_value'), // The specific value that triggered unlock

  // Completion tracking (for repeatable achievements)
  completionCount: integer('completion_count').notNull().default(1),
  lastProgressUpdate: timestamp('last_progress_update'),

  // Social aspects
  isPublic: boolean('is_public').notNull().default(true),
  celebrationShared: boolean('celebration_shared').notNull().default(false),
  sharedAt: timestamp('shared_at'),

  // User reactions
  userReaction: text('user_reaction'), // 'love', 'like', 'neutral'
  userNote: text('user_note'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, table => ({
  userAchievementUnique: primaryKey({
    columns: [table.userId, table.achievementId],
    name: 'user_achievements_pkey',
  }),
  userIdx: index('user_achievements_user_idx').on(table.userId),
  achievementIdx: index('user_achievements_achievement_idx').on(table.achievementId),
  unlockedAtIdx: index('user_achievements_unlocked_at_idx').on(table.unlockedAt),
  progressIdx: index('user_achievements_progress_idx').on(table.progress),
}));

// XP transactions table - Track all XP gains and losses
export const xpTransactions = pgTable('xp_transactions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => auth_user.id, { onDelete: 'cascade' }),

  // Transaction details
  amount: integer('amount').notNull(), // Can be positive or negative
  source: xpSourceEnum('source').notNull(),
  description: text('description').notNull(),

  // Context
  contextId: text('context_id'), // Related entity ID (quiz_attempt, study_session, etc.)
  contextType: text('context_type'), // Type of related entity
  metadata: jsonb('metadata'), // Additional context data

  // Transaction status
  status: text('status').notNull().default('completed'), // 'pending', 'completed', 'reverted'
  isBonus: boolean('is_bonus').notNull().default(false), // Bonus XP for special events
  isMultiplied: boolean('is_multiplied').notNull().default(false), // Applied multipliers

  // Multiplier details
  multiplier: decimal('multiplier', { precision: 3, scale: 2 }).notNull().default('1'),
  multiplierReason: text('multiplier_reason'), // Why multiplier was applied

  // Time tracking
  transactionDate: timestamp('transaction_date').notNull().defaultNow(),
  processedAt: timestamp('processed_at'),
  expiresAt: timestamp('expires_at'), // For temporary XP

  // Reversal tracking
  reversedAt: timestamp('reversed_at'),
  reversedBy: text('reversed_by').references(() => auth_user.id),
  reversalReason: text('reversal_reason'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
}, table => ({
  userIdx: index('xp_transactions_user_idx').on(table.userId),
  sourceIdx: index('xp_transactions_source_idx').on(table.source),
  amountIdx: index('xp_transactions_amount_idx').on(table.amount),
  transactionDateIdx: index('xp_transactions_transaction_date_idx').on(table.transactionDate),
  statusIdx: index('xp_transactions_status_idx').on(table.status),
  contextIdx: index('xp_transactions_context_idx').on(table.contextId, table.contextType),
}));

// Levels table - Define level progression
export const levels = pgTable('levels', {
  id: serial('id').primaryKey(),
  level: integer('level').notNull().unique(),

  // XP requirements
  xpRequired: integer('xp_required').notNull(), // Total XP needed to reach this level
  xpRangeStart: integer('xp_range_start').notNull(), // XP range for this level
  xpRangeEnd: integer('xp_range_end').notNull(),

  // Level classification
  tier: levelTierEnum('tier').notNull(),
  title: text('title').notNull(), // "Débutant", "Apprenti", "Expert", etc.

  // Rewards and benefits
  rewards: jsonb('rewards'), // Array of rewards at this level
  newFeatures: text('new_features').array(), // Features unlocked at this level
  bonusXP: integer('bonus_xp').notNull().default(0),

  // Visual elements
  badgeIcon: text('badge_icon'),
  color: text('color'),
  celebrationMessage: text('celebration_message'),

  // Special properties
  isMilestone: boolean('is_milestone').notNull().default(false), // Important milestone levels
  maxLevel: boolean('max_level').notNull().default(false),

  // Progression
  nextLevelBonus: decimal('next_level_bonus', { precision: 3, scale: 2 }).notNull().default('1'), // XP multiplier

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, table => ({
  levelIdx: index('levels_level_idx').on(table.level),
  xpRequiredIdx: index('levels_xp_required_idx').on(table.xpRequired),
  tierIdx: index('levels_tier_idx').on(table.tier),
  milestoneIdx: index('levels_milestone_idx').on(table.isMilestone),
}));

// User level history table - Track level progression
export const userLevelHistory = pgTable('user_level_history', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => auth_user.id, { onDelete: 'cascade' }),

  // Level change details
  fromLevel: integer('from_level').notNull(),
  toLevel: integer('to_level').notNull(),
  xpAtLevelUp: integer('xp_at_level_up').notNull(),

  // Time tracking
  leveledUpAt: timestamp('leveled_up_at').notNull().defaultNow(),
  timeAtPreviousLevel: integer('time_at_previous_level'), // Minutes spent at previous level

  // Celebration
  celebrationViewed: boolean('celebration_viewed').notNull().default(false),
  celebrationViewedAt: timestamp('celebration_viewed_at'),
  rewardsClaimed: boolean('rewards_claimed').notNull().default(false),
  rewardsClaimedAt: timestamp('rewards_claimed_at'),

  // Context
  levelUpSource: text('level_up_source').notNull(), // What caused the level up
  achievementUnlocked: boolean('achievement_unlocked').notNull().default(false),

  createdAt: timestamp('created_at').defaultNow().notNull(),
}, table => ({
  userIdx: index('user_level_history_user_idx').on(table.userId),
  toLevelIdx: index('user_level_history_to_level_idx').on(table.toLevel),
  leveledUpAtIdx: index('user_level_history_leveled_up_at_idx').on(table.leveledUpAt),
}));

// Leaderboards table - Define different leaderboard types
export const leaderboards = pgTable('leaderboards', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type').notNull(), // 'weekly', 'monthly', 'all_time', 'subject_specific'

  // Scoring criteria
  scoreType: text('score_type').notNull(), // 'total_xp', 'study_streak', 'quiz_average', etc.
  scoringRules: jsonb('scoring_rules').notNull(), // How to calculate scores

  // Filtering
  gradeFilter: text('grade_filter').array(), // ['3ème'], ['Terminale']
  subjectFilter: integer('subject_filter').array(), // Specific subjects
  regionFilter: text('region_filter').array(), // Geographic regions

  // Schedule
  isActive: boolean('is_active').notNull().default(true),
  resetSchedule: text('reset_schedule'), // 'weekly', 'monthly', 'quarterly'
  lastResetAt: timestamp('last_reset_at'),
  nextResetAt: timestamp('next_reset_at'),

  // Prizes and rewards
  prizePool: jsonb('prize_pool'), // Prizes for top performers
  participationReward: integer('participation_reward'),

  // Display settings
  maxEntries: integer('max_entries').notNull().default(100),
  showUserRank: boolean('show_user_rank').notNull().default(true),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, table => ({
  typeIdx: index('leaderboards_type_idx').on(table.type),
  scoreTypeIdx: index('leaderboards_score_type_idx').on(table.scoreType),
  activeIdx: index('leaderboards_active_idx').on(table.isActive),
  resetScheduleIdx: index('leaderboards_reset_schedule_idx').on(table.resetSchedule),
}));

// Leaderboard entries table - Current rankings
export const leaderboardEntries = pgTable('leaderboard_entries', {
  id: serial('id').primaryKey(),
  leaderboardId: integer('leaderboard_id').notNull().references(() => leaderboards.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => auth_user.id, { onDelete: 'cascade' }),

  // Ranking
  rank: integer('rank').notNull(),
  previousRank: integer('previous_rank'),
  score: integer('score').notNull(),
  scoreChange: integer('score_change').notNull().default(0),

  // Statistics
  participationCount: integer('participation_count').notNull().default(0),
  bestRank: integer('best_rank'),
  averageRank: decimal('average_rank', { precision: 6, scale: 2 }),

  // Time tracking
  firstAppeared: timestamp('first_appeared').notNull().defaultNow(),
  lastUpdated: timestamp('last_updated').notNull().defaultNow(),
  daysOnLeaderboard: integer('days_on_leaderboard').notNull().default(0),

  // Badge rewards
  badges: text('badges').array(), // Earned badges from leaderboard performance

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, table => ({
  leaderboardUserUnique: primaryKey({
    columns: [table.leaderboardId, table.userId],
    name: 'leaderboard_entries_pkey',
  }),
  leaderboardIdx: index('leaderboard_entries_leaderboard_id_idx').on(table.leaderboardId),
  userIdx: index('leaderboard_entries_user_id_idx').on(table.userId),
  rankIdx: index('leaderboard_entries_rank_idx').on(table.rank),
  scoreIdx: index('leaderboard_entries_score_idx').on(table.score),
}));

// Daily challenges table - Daily/weekly challenges for engagement
export const dailyChallenges = pgTable('daily_challenges', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  description: text('description').notNull(),

  // Challenge details
  type: text('type').notNull(), // 'study_time', 'quiz_score', 'flashcard_review', etc.
  requirement: jsonb('requirement').notNull(), // { minutes: 30, score: 80, cards: 20 }
  difficulty: text('difficulty').notNull().default('medium'), // 'easy', 'medium', 'hard'

  // Rewards
  xpReward: integer('xp_reward').notNull().default(5),
  bonusReward: jsonb('bonus_reward'), // Additional rewards

  // Schedule
  challengeDate: timestamp('challenge_date').notNull(),
  validFrom: timestamp('valid_from').notNull(),
  validUntil: timestamp('valid_until').notNull(),
  timezone: text('timezone').notNull().default('Africa/Abidjan'),

  // Targeting
  targetGrades: text('target_grades').array(), // Who can participate
  targetSubjects: integer('target_subjects').array(), // Subject-specific challenges

  // Participation limits
  maxParticipants: integer('max_participants'),
  currentParticipants: integer('current_participants').notNull().default(0),

  // Visual
  icon: text('icon'),
  color: text('color'),

  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, table => ({
  challengeDateIdx: index('daily_challenges_challenge_date_idx').on(table.challengeDate),
  typeIdx: index('daily_challenges_type_idx').on(table.type),
  validUntilIdx: index('daily_challenges_valid_until_idx').on(table.validUntil),
  activeIdx: index('daily_challenges_active_idx').on(table.isActive),
}));

// User challenge progress table - Track challenge completion
export const userChallengeProgress = pgTable('user_challenge_progress', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => auth_user.id, { onDelete: 'cascade' }),
  challengeId: text('challenge_id').notNull().references(() => dailyChallenges.id, { onDelete: 'cascade' }),

  // Progress tracking
  progress: decimal('progress', { precision: 5, scale: 2 }).notNull().default('0'), // 0-100
  currentValue: integer('current_value').notNull().default(0),
  targetValue: integer('target_value').notNull(),

  // Completion
  isCompleted: boolean('is_completed').notNull().default(false),
  completedAt: timestamp('completed_at'),
  rewardsClaimed: boolean('rewards_claimed').notNull().default(false),
  rewardsClaimedAt: timestamp('rewards_claimed_at'),

  // Participation
  startedAt: timestamp('started_at').notNull().defaultNow(),
  lastProgressAt: timestamp('last_progress_at'),

  // Performance
  completionTime: integer('completion_time'), // How long it took to complete
  attempts: integer('attempts').notNull().default(0),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, table => ({
  userChallengeUnique: primaryKey({
    columns: [table.userId, table.challengeId],
    name: 'user_challenge_progress_pkey',
  }),
  userIdx: index('user_challenge_progress_user_idx').on(table.userId),
  challengeIdx: index('user_challenge_progress_challenge_idx').on(table.challengeId),
  completedIdx: index('user_challenge_progress_completed_idx').on(table.isCompleted),
  progressIdx: index('user_challenge_progress_progress_idx').on(table.progress),
}));

// Import related tables
