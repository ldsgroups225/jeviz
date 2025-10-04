import {
  boolean,
  decimal,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

// Import auth_user from auth schema for the foreign key reference
import { auth_user } from './auth-schema';

// Enums for Ivory Coast curriculum
export const gradeEnum = pgEnum('grade', ['3ème', 'Terminale']);
export const seriesEnum = pgEnum('series', ['A', 'C', 'D', 'E', 'G']);
export const examFormatEnum = pgEnum('exam_format', ['écrit', 'pratique', 'oral']);
export const difficultyEnum = pgEnum('difficulty', ['facile', 'moyen', 'difficile']);

// Subjects table - Core Ivory Coast curriculum subjects
export const subjects = pgTable('subjects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  shortName: text('short_name').notNull(), // FR, MATH, PC, SVT, etc.
  grade: gradeEnum('grade').notNull(),
  series: text('series').array(), // null for core subjects, array for series-specific
  coefficient: integer('coefficient').notNull(), // Base coefficient, can be overridden by series
  examDuration: integer('exam_duration').notNull(), // Duration in minutes
  examFormat: examFormatEnum('exam_format').notNull().default('écrit'),
  isCore: boolean('is_core').notNull().default(false), // True for mandatory subjects
  languageChoice: boolean('language_choice').notNull().default(false), // True for ALL/ESP second language
  mutualExclusiveWith: integer('mutual_exclusive_with'), // Reference to another subject ID for language choices
  description: text('description'), // Optional description
  color: text('color').default('#3B82F6'), // For UI theming
  icon: text('icon'), // Icon name for UI
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, table => ({
  gradeIdx: index('subjects_grade_idx').on(table.grade),
  shortNameIdx: index('subjects_short_name_idx').on(table.shortName),
  seriesIdx: index('subjects_series_idx').on(table.series),
}));

// Chapters table - Topic breakdown per subject
export const chapters = pgTable('chapters', {
  id: serial('id').primaryKey(),
  subjectId: integer('subject_id').notNull().references(() => subjects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  order: integer('order').notNull(),
  estimatedHours: decimal('estimated_hours', { precision: 4, scale: 1 }).default('1'),
  difficulty: difficultyEnum('difficulty').notNull().default('moyen'),
  objectives: text('objectives').array(), // Learning objectives
  prerequisites: text('prerequisites').array(), // Required knowledge
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

// User profiles - Extended user data for Jeviz
export const userProfiles = pgTable('user_profiles', {
  userId: text('user_id').primaryKey().references(() => auth_user.id, { onDelete: 'cascade' }),
  grade: gradeEnum('grade').notNull(),
  series: seriesEnum('series'), // null for 3ème
  secondLanguage: text('second_language'), // 'ALL' or 'ESP' for Terminale A/C/D
  school: text('school'),
  region: text('region'),
  examDate: text('exam_date'), // YYYY-MM-DD format
  studyGoal: text('study_goal'), // e.g., "mention très bien"
  dailyStudyTime: integer('daily_study_time').default(60), // minutes
  preferredStudyTime: text('preferred_study_time'), // 'morning', 'afternoon', 'evening'
  studyStreak: integer('study_streak').default(0),
  lastStudyDate: text('last_study_date'), // YYYY-MM-DD format
  totalXP: integer('total_xp').default(0),
  level: integer('level').default(1),
  currentXP: integer('current_xp').default(0), // XP towards next level
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
