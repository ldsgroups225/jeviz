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
import { chapters, subjects } from './subjects-schema';

// Enums for group functionality
export const groupRoleEnum = pgEnum('group_role', ['owner', 'admin', 'member', 'moderator']);
export const groupTypeEnum = pgEnum('group_type', ['study', 'exam_prep', 'subject_focus', 'general']);
export const groupVisibilityEnum = pgEnum('group_visibility', ['public', 'private', 'invite_only']);
export const membershipStatusEnum = pgEnum('membership_status', ['active', 'pending', 'banned', 'left']);

// Study groups table - Main groups table
export const groups = pgTable('groups', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  description: text('description'),
  tagline: text('tagline'), // Short catchy description

  // Group classification
  type: groupTypeEnum('type').notNull().default('study'),
  visibility: groupVisibilityEnum('visibility').notNull().default('public'),
  subjectId: integer('subject_id').references(() => subjects.id, { onDelete: 'set null' }), // null for multi-subject groups

  // Target audience
  grade: text('grade').array(), // ['3ème'], ['Terminale'], or both
  series: text('series').array(), // ['A', 'C'], null for all series
  language: text('language'), // 'fr', 'en', or null for both

  // Group settings
  maxMembers: integer('max_members').notNull().default(50),
  allowInvites: boolean('allow_invites').notNull().default(true),
  requireApproval: boolean('require_approval').notNull().default(false),
  allowGuests: boolean('allow_guests').notNull().default(false),

  // Location and community
  school: text('school'), // Specific school or null for open
  region: text('region'), // Geographic region
  city: text('city'),
  country: text('country').default('Côte d\'Ivoire'),

  // Visual identity
  avatarUrl: text('avatar_url'),
  bannerUrl: text('banner_url'),
  color: text('color').default('#3B82F6'),
  emoji: text('emoji'), // Group emoji/icon

  // Leadership
  ownerId: text('owner_id').notNull().references(() => auth_user.id, { onDelete: 'cascade' }),

  // Activity and engagement
  memberCount: integer('member_count').notNull().default(1), // Includes owner
  isActive: boolean('is_active').notNull().default(true),
  isVerified: boolean('is_verified').notNull().default(false), // Official school groups

  // Statistics
  totalStudyTime: integer('total_study_time').notNull().default(0), // minutes
  averageWeeklyStudy: decimal('average_weekly_study', { precision: 8, scale: 2 }).notNull().default('0'),
  lastActivityAt: timestamp('last_activity_at'),

  // Group goals and progress
  collectiveGoals: jsonb('collective_goals'), // Array of { goal, target, deadline, progress }
  achievements: jsonb('achievements'), // Group achievements

  // Content and resources
  sharedResources: jsonb('shared_resources'), // Count of shared materials
  discussionCount: integer('discussion_count').notNull().default(0),
  quizCount: integer('quiz_count').notNull().default(0),

  // Scheduling
  studySchedule: jsonb('study_schedule'), // Regular study times
  nextGroupSession: timestamp('next_group_session'),

  // Rules and guidelines
  rules: text('rules').array(),
  welcomeMessage: text('welcome_message'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, table => ({
  nameIdx: index('groups_name_idx').on(table.name),
  ownerIdIdx: index('groups_owner_id_idx').on(table.ownerId),
  subjectIdx: index('groups_subject_id_idx').on(table.subjectId),
  visibilityIdx: index('groups_visibility_idx').on(table.visibility),
  gradeIdx: index('groups_grade_idx').on(table.grade),
  schoolIdx: index('groups_school_idx').on(table.school),
  activeIdx: index('groups_active_idx').on(table.isActive),
  memberCountIdx: index('groups_member_count_idx').on(table.memberCount),
  lastActivityIdx: index('groups_last_activity_idx').on(table.lastActivityAt),
}));

// Group members table - Membership tracking
export const groupMembers = pgTable('group_members', {
  id: serial('id').primaryKey(),
  groupId: text('group_id').notNull().references(() => groups.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => auth_user.id, { onDelete: 'cascade' }),

  // Membership details
  role: groupRoleEnum('role').notNull().default('member'),
  status: membershipStatusEnum('status').notNull().default('active'),
  title: text('title'), // Custom title like "Expert en Mathématiques"

  // Joining information
  invitedBy: text('invited_by').references(() => auth_user.id),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
  approvedBy: text('approved_by').references(() => auth_user.id),
  approvedAt: timestamp('approved_at'),

  // Participation statistics
  lastActiveAt: timestamp('last_active_at'),
  studySessionsJoined: integer('study_sessions_joined').notNull().default(0),
  messagesPosted: integer('messages_posted').notNull().default(0),
  resourcesShared: integer('resources_shared').notNull().default(0),
  quizzesCreated: integer('quizzes_created').notNull().default(0),

  // Contribution metrics
  totalStudyTime: integer('total_study_time').notNull().default(0), // minutes in group sessions
  helpProvided: integer('help_provided').notNull().default(0), // Number of times helped others
  reputation: integer('reputation').notNull().default(0), // Community reputation points

  // Notification preferences
  emailNotifications: boolean('email_notifications').notNull().default(true),
  pushNotifications: boolean('push_notifications').notNull().default(true),
  weeklyDigest: boolean('weekly_digest').notNull().default(true),

  // Notes and status
  notes: text('notes'), // Admin notes about member
  isBanned: boolean('is_banned').notNull().default(false),
  bannedAt: timestamp('banned_at'),
  bannedReason: text('banned_reason'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, table => ({
  groupUserUnique: primaryKey({
    columns: [table.groupId, table.userId],
    name: 'group_members_pkey',
  }),
  groupIdIdx: index('group_members_group_id_idx').on(table.groupId),
  userIdx: index('group_members_user_id_idx').on(table.userId),
  roleIdx: index('group_members_role_idx').on(table.role),
  statusIdx: index('group_members_status_idx').on(table.status),
  joinedAtIdx: index('group_members_joined_at_idx').on(table.joinedAt),
  lastActiveIdx: index('group_members_last_active_idx').on(table.lastActiveAt),
}));

// Group study sessions table - Collaborative study sessions
export const groupStudySessions = pgTable('group_study_sessions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  groupId: text('group_id').notNull().references(() => groups.id, { onDelete: 'cascade' }),
  hostId: text('host_id').notNull().references(() => auth_user.id, { onDelete: 'cascade' }),

  // Session details
  title: text('title').notNull(),
  description: text('description'),
  sessionType: text('session_type').notNull().default('study'), // 'study', 'quiz', 'review', 'discussion'

  // Focus topics
  subjectId: integer('subject_id').references(() => subjects.id, { onDelete: 'set null' }),
  chapterId: integer('chapter_id').references(() => chapters.id, { onDelete: 'set null' }),
  topics: text('topics').array(),
  focusAreas: text('focus_areas').array(),

  // Scheduling
  scheduledFor: timestamp('scheduled_for').notNull(),
  duration: integer('duration').notNull(), // minutes
  timezone: text('timezone').notNull().default('Africa/Abidjan'),

  // Session configuration
  maxParticipants: integer('max_participants'), // null for unlimited
  isRecurring: boolean('is_recurring').notNull().default(false),
  recurringPattern: jsonb('recurring_pattern'), // { frequency: 'weekly', days: [1, 3, 5] }

  // Location and platform
  location: text('location'), // 'virtual', 'physical', or specific location
  platform: text('platform'), // 'zoom', 'meet', 'discord', 'teams', etc.
  meetingLink: text('meeting_link'),
  meetingId: text('meeting_id'),
  meetingPassword: text('meeting_password'),

  // Participation
  participantLimit: integer('participant_limit'),
  minParticipants: integer('min Participants').notNull().default(2),
  currentParticipants: integer('current_participants').notNull().default(0),

  // Session status
  status: text('status').notNull().default('scheduled'), // 'scheduled', 'started', 'completed', 'cancelled'
  startedAt: timestamp('started_at'),
  endedAt: timestamp('ended_at'),
  cancelledAt: timestamp('cancelled_at'),
  cancelReason: text('cancel_reason'),

  // Materials and resources
  materials: jsonb('materials'), // Array of { type, url, name, description }
  requiredPreparation: text('required_preparation').array(),
  sharedNotes: text('shared_notes'),

  // Session outcomes
  actualDuration: integer('actual_duration'), // minutes
  averageParticipation: decimal('average_participation', { precision: 3, scale: 2 }), // 0-1
  satisfactionRating: decimal('satisfaction_rating', { precision: 3, scale: 2 }), // 0-5

  // Follow-up
  recordingUrl: text('recording_url'),
  summary: text('summary'),
  actionItems: text('action_items').array(),
  nextSessionDate: timestamp('next_session_date'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, table => ({
  groupIdIdx: index('group_study_sessions_group_id_idx').on(table.groupId),
  hostIdIdx: index('group_study_sessions_host_id_idx').on(table.hostId),
  scheduledForIdx: index('group_study_sessions_scheduled_for_idx').on(table.scheduledFor),
  statusIdx: index('group_study_sessions_status_idx').on(table.status),
  subjectIdx: index('group_study_sessions_subject_id_idx').on(table.subjectId),
}));

// Group session participants table - Track who attended sessions
export const groupSessionParticipants = pgTable('group_session_participants', {
  id: serial('id').primaryKey(),
  sessionId: text('session_id').notNull().references(() => groupStudySessions.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => auth_user.id, { onDelete: 'cascade' }),

  // Participation details
  joinedAt: timestamp('joined_at'),
  leftAt: timestamp('left_at'),
  totalMinutes: integer('total_minutes').notNull().default(0),

  // Engagement metrics
  messagesSent: integer('messages_sent').notNull().default(0),
  questionsAsked: integer('questions_asked').notNull().default(0),
  answersProvided: integer('answers_provided').notNull().default(0),
  screenShares: integer('screen_shares').notNull().default(0),

  // Self-assessment
  understandingRating: integer('understanding_rating'), // 1-5 scale
  engagementRating: integer('engagement_rating'), // 1-5 scale
  usefulnessRating: integer('usefulness_rating'), // 1-5 scale

  // Notes and feedback
  personalNotes: text('personal_notes'),
  feedback: text('feedback'),
  whatLearned: text('what_learned').array(),

  // Technical aspects
  connectionQuality: text('connection_quality'), // 'excellent', 'good', 'fair', 'poor'
  technicalIssues: text('technical_issues').array(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, table => ({
  sessionUserUnique: primaryKey({
    columns: [table.sessionId, table.userId],
    name: 'group_session_participants_pkey',
  }),
  sessionIdIdx: index('group_session_participants_session_id_idx').on(table.sessionId),
  userIdx: index('group_session_participants_user_id_idx').on(table.userId),
  joinedAtIdx: index('group_session_participants_joined_at_idx').on(table.joinedAt),
}));

// Group discussions table - Discussion forums within groups
export const groupDiscussions = pgTable('group_discussions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  groupId: text('group_id').notNull().references(() => groups.id, { onDelete: 'cascade' }),
  authorId: text('author_id').notNull().references(() => auth_user.id, { onDelete: 'cascade' }),

  // Discussion content
  title: text('title'),
  content: text('content').notNull(),
  type: text('type').notNull().default('question'), // 'question', 'discussion', 'announcement', 'resource'

  // Topic categorization
  subjectId: integer('subject_id').references(() => subjects.id, { onDelete: 'set null' }),
  chapterId: integer('chapter_id').references(() => chapters.id, { onDelete: 'set null' }),
  tags: text('tags').array(),

  // Discussion metadata
  isPinned: boolean('is_pinned').notNull().default(false),
  isLocked: boolean('is_locked').notNull().default(false),
  isAnswered: boolean('is_answered').notNull().default(false),

  // Engagement metrics
  views: integer('views').notNull().default(0),
  replies: integer('replies').notNull().default(0),
  likes: integer('likes').notNull().default(0),
  helpfulVotes: integer('helpful_votes').notNull().default(0),

  // Status and activity
  status: text('status').notNull().default('active'), // 'active', 'closed', 'deleted'
  lastReplyAt: timestamp('last_reply_at'),
  lastReplyBy: text('last_reply_by').references(() => auth_user.id),

  // Moderation
  moderatedBy: text('moderated_by').references(() => auth_user.id),
  moderatedAt: timestamp('moderated_at'),
  moderationReason: text('moderation_reason'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, table => ({
  groupIdIdx: index('group_discussions_group_id_idx').on(table.groupId),
  authorIdIdx: index('group_discussions_author_id_idx').on(table.authorId),
  typeIdx: index('group_discussions_type_idx').on(table.type),
  subjectIdx: index('group_discussions_subject_id_idx').on(table.subjectId),
  isPinnedIdx: index('group_discussions_is_pinned_idx').on(table.isPinned),
  repliesIdx: index('group_discussions_replies_idx').on(table.replies),
  lastReplyIdx: index('group_discussions_last_reply_idx').on(table.lastReplyAt),
}));

// Group invitations table - Invitation system
export const groupInvitations = pgTable('group_invitations', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  groupId: text('group_id').notNull().references(() => groups.id, { onDelete: 'cascade' }),
  invitedBy: text('invited_by').notNull().references(() => auth_user.id, { onDelete: 'cascade' }),
  invitedEmail: text('invited_email').notNull(),
  invitedUserId: text('invited_user_id').references(() => auth_user.id, { onDelete: 'cascade' }),

  // Invitation details
  message: text('message'), // Personal invitation message
  role: groupRoleEnum('role').notNull().default('member'),

  // Status tracking
  status: text('status').notNull().default('pending'), // 'pending', 'accepted', 'declined', 'expired'
  respondedAt: timestamp('responded_at'),
  responseMessage: text('response_message'),

  // Expiration
  expiresAt: timestamp('expires_at'),
  reminderSent: boolean('reminder_sent').notNull().default(false),
  lastReminderAt: timestamp('last_reminder_at'),

  // Usage tracking
  invitationLink: text('invitation_link'),
  linkClicks: integer('link_clicks').notNull().default(0),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, table => ({
  groupIdIdx: index('group_invitations_group_id_idx').on(table.groupId),
  invitedByIdx: index('group_invitations_invited_by_idx').on(table.invitedBy),
  invitedEmailIdx: index('group_invitations_invited_email_idx').on(table.invitedEmail),
  invitedUserIdIdx: index('group_invitations_invited_user_id_idx').on(table.invitedUserId),
  statusIdx: index('group_invitations_status_idx').on(table.status),
  expiresAtIdx: index('group_invitations_expires_at_idx').on(table.expiresAt),
}));

// Import related tables
