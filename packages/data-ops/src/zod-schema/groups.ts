import { z } from 'zod';

// Enums
export const GroupRoleSchema = z.enum(['owner', 'admin', 'member', 'moderator']);
export const GroupTypeSchema = z.enum(['study', 'exam_prep', 'subject_focus', 'general']);
export const GroupVisibilitySchema = z.enum(['public', 'private', 'invite_only']);
export const MembershipStatusSchema = z.enum(['active', 'pending', 'banned', 'left']);

// Group schemas
export const GroupCreateSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  description: z.string().max(500, 'La description ne peut pas dépasser 500 caractères').optional(),
  tagline: z.string().max(200, 'Le slogan ne peut pas dépasser 200 caractères').optional(),
  type: GroupTypeSchema.default('study'),
  visibility: GroupVisibilitySchema.default('public'),
  subjectId: z.number().int().positive('L\'ID du sujet est requis').optional(),
  grade: z.array(z.enum(['3ème', 'Terminale'])).optional(),
  series: z.array(z.enum(['A', 'C', 'D', 'E', 'G'])).optional(),
  language: z.enum(['fr', 'en']).optional(),
  maxMembers: z.number().int().min(2, 'Le nombre maximum de membres doit être au moins 2').max(500, 'Le nombre maximum de membres ne peut pas dépasser 500').default(50),
  allowInvites: z.boolean().default(true),
  requireApproval: z.boolean().default(false),
  allowGuests: z.boolean().default(false),
  school: z.string().max(100, 'Le nom de l\'école ne peut pas dépasser 100 caractères').optional(),
  region: z.string().max(50, 'La région ne peut pas dépasser 50 caractères').optional(),
  city: z.string().max(50, 'La ville ne peut pas dépasser 50 caractères').optional(),
  country: z.string().max(50, 'Le pays ne peut pas dépasser 50 caractères').default('Côte d\'Ivoire'),
  avatarUrl: z.string().url('L\'URL de l\'avatar doit être valide').optional(),
  bannerUrl: z.string().url('L\'URL de la bannière doit être valide').optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'La couleur doit être un code hexadécimal valide').default('#3B82F6'),
  emoji: z.string().max(10, 'L\'emoji ne peut pas dépasser 10 caractères').optional(),
  collectiveGoals: z.array(z.object({
    goal: z.string().max(200),
    target: z.string().max(100),
    deadline: z.string().datetime().optional(),
    progress: z.number().min(0).max(100).default(0),
  })).optional(),
  studySchedule: z.array(z.object({
    dayOfWeek: z.number().int().min(0).max(6), // 0 = Sunday
    startTime: z.string().regex(/^([01]?\d|2[0-3]):[0-5]\d$/, 'L\'heure de début doit être au format HH:MM'),
    endTime: z.string().regex(/^([01]?\d|2[0-3]):[0-5]\d$/, 'L\'heure de fin doit être au format HH:MM'),
    activity: z.string().max(100),
  })).optional(),
  rules: z.array(z.string().max(200, 'Chaque règle ne peut pas dépasser 200 caractères')).optional(),
  welcomeMessage: z.string().max(1000, 'Le message de bienvenue ne peut pas dépasser 1000 caractères').optional(),
});

export const GroupUpdateSchema = GroupCreateSchema.partial();

export const GroupFilterSchema = z.object({
  type: GroupTypeSchema.optional(),
  visibility: GroupVisibilitySchema.optional(),
  subjectId: z.number().int().positive().optional(),
  grade: z.array(z.enum(['3ème', 'Terminale'])).optional(),
  series: z.array(z.enum(['A', 'C', 'D', 'E', 'G'])).optional(),
  school: z.string().optional(),
  region: z.string().optional(),
  hasActiveMembers: z.boolean().optional(),
  minMembers: z.number().int().min(1).optional(),
  maxMembers: z.number().int().positive().optional(),
  search: z.string().optional(),
});

// Group member schemas
export const GroupMemberCreateSchema = z.object({
  groupId: z.string().min(1, 'L\'ID du groupe est requis'),
  userId: z.string().min(1, 'L\'ID utilisateur est requis'),
  role: GroupRoleSchema.default('member'),
  status: MembershipStatusSchema.default('active'),
  title: z.string().max(100, 'Le titre ne peut pas dépasser 100 caractères').optional(),
  invitedBy: z.string().optional(),
  joinedAt: z.string().datetime().optional(),
  approvedBy: z.string().optional(),
  approvedAt: z.string().datetime().optional(),
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  weeklyDigest: z.boolean().default(true),
  notes: z.string().max(500, 'Les notes ne peuvent pas dépasser 500 caractères').optional(),
});

export const GroupMemberUpdateSchema = GroupMemberCreateSchema.partial();

// Group study session schemas
export const GroupStudySessionCreateSchema = z.object({
  groupId: z.string().min(1, 'L\'ID du groupe est requis'),
  hostId: z.string().min(1, 'L\'ID de l\'hôte est requis'),
  title: z.string().min(1, 'Le titre est requis').max(200, 'Le titre ne peut pas dépasser 200 caractères'),
  description: z.string().max(1000, 'La description ne peut pas dépasser 1000 caractères').optional(),
  sessionType: z.enum(['study', 'quiz', 'review', 'discussion']).default('study'),
  subjectId: z.number().int().positive('L\'ID du sujet est requis').optional(),
  chapterId: z.number().int().positive('L\'ID du chapitre est requis').optional(),
  topics: z.array(z.string().max(100, 'Chaque sujet ne peut pas dépasser 100 caractères')).optional(),
  focusAreas: z.array(z.string().max(100, 'Chaque domaine de concentration ne peut pas dépasser 100 caractères')).optional(),
  scheduledFor: z.string().datetime('La date planifiée est requise'),
  duration: z.number().int().min(15, 'La durée doit être au moins 15 minutes').max(480, 'La durée ne peut pas dépasser 8 heures'),
  timezone: z.string().default('Africa/Abidjan'),
  maxParticipants: z.number().int().min(2, 'Le nombre maximum de participants doit être au moins 2').optional(),
  minParticipants: z.number().int().min(2, 'Le nombre minimum de participants doit être au moins 2').default(2),
  isRecurring: z.boolean().default(false),
  recurringPattern: z.object({
    frequency: z.enum(['daily', 'weekly', 'monthly']),
    interval: z.number().int().min(1).default(1),
    daysOfWeek: z.array(z.number().int().min(0).max(6)).optional(),
    endDate: z.string().datetime().optional(),
  }).optional(),
  location: z.enum(['virtual', 'physical']).default('virtual'),
  platform: z.string().max(50, 'La plateforme ne peut pas dépasser 50 caractères').optional(),
  meetingLink: z.string().url('Le lien de réunion doit être valide').optional(),
  meetingId: z.string().max(100, 'L\'ID de réunion ne peut pas dépasser 100 caractères').optional(),
  meetingPassword: z.string().max(50, 'Le mot de passe de réunion ne peut pas dépasser 50 caractères').optional(),
  materials: z.array(z.object({
    type: z.string().max(50),
    url: z.string().url(),
    name: z.string().max(200),
    description: z.string().max(500).optional(),
  })).optional(),
  requiredPreparation: z.array(z.string().max(200, 'Chaque prérequis ne peut pas dépasser 200 caractères')).optional(),
});

export const GroupStudySessionUpdateSchema = z.object({
  status: z.enum(['scheduled', 'started', 'completed', 'cancelled']).optional(),
  startedAt: z.string().datetime().optional(),
  endedAt: z.string().datetime().optional(),
  cancelledAt: z.string().datetime().optional(),
  cancelReason: z.string().max(500, 'La raison d\'annulation ne peut pas dépasser 500 caractères').optional(),
  currentParticipants: z.number().int().min(0).optional(),
  actualDuration: z.number().int().min(0).optional(),
  averageParticipation: z.number().min(0).max(1).optional(),
  satisfactionRating: z.number().min(1).max(5).optional(),
  sharedNotes: z.string().max(2000, 'Les notes partagées ne peuvent pas dépasser 2000 caractères').optional(),
  recordingUrl: z.string().url('L\'URL d\'enregistrement doit être valide').optional(),
  summary: z.string().max(2000, 'Le résumé ne peut pas dépasser 2000 caractères').optional(),
  actionItems: z.array(z.string().max(200, 'Chaque action ne peut pas dépasser 200 caractères')).optional(),
  nextSessionDate: z.string().datetime().optional(),
});

// Group discussion schemas
export const GroupDiscussionCreateSchema = z.object({
  groupId: z.string().min(1, 'L\'ID du groupe est requis'),
  authorId: z.string().min(1, 'L\'ID de l\'auteur est requis'),
  title: z.string().max(200, 'Le titre ne peut pas dépasser 200 caractères').optional(),
  content: z.string().min(1, 'Le contenu est requis').max(2000, 'Le contenu ne peut pas dépasser 2000 caractères'),
  type: z.enum(['question', 'discussion', 'announcement', 'resource']).default('discussion'),
  subjectId: z.number().int().positive('L\'ID du sujet est requis').optional(),
  chapterId: z.number().int().positive('L\'ID du chapitre est requis').optional(),
  tags: z.array(z.string().max(50, 'Chaque tag ne peut pas dépasser 50 caractères')).optional(),
  isPinned: z.boolean().default(false),
  isLocked: z.boolean().default(false),
});

export const GroupDiscussionUpdateSchema = z.object({
  title: z.string().max(200).optional(),
  content: z.string().max(2000).optional(),
  type: z.enum(['question', 'discussion', 'announcement', 'resource']).optional(),
  tags: z.array(z.string().max(50)).optional(),
  isPinned: z.boolean().optional(),
  isLocked: z.boolean().optional(),
  isAnswered: z.boolean().optional(),
  moderatedBy: z.string().optional(),
  moderatedAt: z.string().datetime().optional(),
  moderationReason: z.string().max(500).optional(),
});

// Group invitation schemas
export const GroupInvitationCreateSchema = z.object({
  groupId: z.string().min(1, 'L\'ID du groupe est requis'),
  invitedBy: z.string().min(1, 'L\'ID de l\'invitant est requis'),
  invitedEmail: z.string().email('L\'email invité doit être valide'),
  invitedUserId: z.string().optional(),
  message: z.string().max(500, 'Le message d\'invitation ne peut pas dépasser 500 caractères').optional(),
  role: GroupRoleSchema.default('member'),
  expiresAt: z.string().datetime().optional(),
});

export const GroupInvitationUpdateSchema = z.object({
  status: z.enum(['pending', 'accepted', 'declined', 'expired']).optional(),
  respondedAt: z.string().datetime().optional(),
  responseMessage: z.string().max(500).optional(),
  reminderSent: z.boolean().optional(),
  lastReminderAt: z.string().datetime().optional(),
});

// Group session participant schemas
export const GroupSessionParticipantCreateSchema = z.object({
  sessionId: z.string().min(1, 'L\'ID de session est requis'),
  userId: z.string().min(1, 'L\'ID utilisateur est requis'),
  joinedAt: z.string().datetime().optional(),
  leftAt: z.string().datetime().optional(),
  totalMinutes: z.number().int().min(0).default(0),
  messagesSent: z.number().int().min(0).default(0),
  questionsAsked: z.number().int().min(0).default(0),
  answersProvided: z.number().int().min(0).default(0),
  screenShares: z.number().int().min(0).default(0),
  understandingRating: z.number().int().min(1).max(5).optional(),
  engagementRating: z.number().int().min(1).max(5).optional(),
  usefulnessRating: z.number().int().min(1).max(5).optional(),
  personalNotes: z.string().max(1000).optional(),
  feedback: z.string().max(1000).optional(),
  whatLearned: z.array(z.string().max(200)).optional(),
  connectionQuality: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
  technicalIssues: z.array(z.string().max(200)).optional(),
});

export const GroupSessionParticipantUpdateSchema = GroupSessionParticipantCreateSchema.partial();

// Group statistics
export const GroupStatisticsSchema = z.object({
  totalMembers: z.number().int().min(0),
  activeMembers: z.number().int().min(0),
  totalStudyTime: z.number().int().min(0),
  averageWeeklyStudy: z.number().min(0),
  totalSessions: z.number().int().min(0),
  upcomingSessions: z.number().int().min(0),
  discussionCount: z.number().int().min(0),
  activeDiscussions: z.number().int().min(0),
  resourceShares: z.number().int().min(0),
  memberEngagement: z.object({
    highlyActive: z.number().int().min(0),
    moderatelyActive: z.number().int().min(0),
    lowActivity: z.number().int().min(0),
    inactive: z.number().int().min(0),
  }),
});

// Validation functions
export function validateGroup(data: unknown) {
  return GroupCreateSchema.safeParse(data);
}

export function validateGroupMember(data: unknown) {
  return GroupMemberCreateSchema.safeParse(data);
}

export function validateGroupStudySession(data: unknown) {
  return GroupStudySessionCreateSchema.safeParse(data);
}

export function validateGroupDiscussion(data: unknown) {
  return GroupDiscussionCreateSchema.safeParse(data);
}

export function validateGroupInvitation(data: unknown) {
  return GroupInvitationCreateSchema.safeParse(data);
}

export function validateGroupFilter(data: unknown) {
  return GroupFilterSchema.safeParse(data);
}

// Type exports
export type GroupCreate = z.infer<typeof GroupCreateSchema>;
export type GroupUpdate = z.infer<typeof GroupUpdateSchema>;
export type GroupFilter = z.infer<typeof GroupFilterSchema>;
export type GroupMemberCreate = z.infer<typeof GroupMemberCreateSchema>;
export type GroupMemberUpdate = z.infer<typeof GroupMemberUpdateSchema>;
export type GroupStudySessionCreate = z.infer<typeof GroupStudySessionCreateSchema>;
export type GroupStudySessionUpdate = z.infer<typeof GroupStudySessionUpdateSchema>;
export type GroupDiscussionCreate = z.infer<typeof GroupDiscussionCreateSchema>;
export type GroupDiscussionUpdate = z.infer<typeof GroupDiscussionUpdateSchema>;
export type GroupInvitationCreate = z.infer<typeof GroupInvitationCreateSchema>;
export type GroupInvitationUpdate = z.infer<typeof GroupInvitationUpdateSchema>;
export type GroupSessionParticipantCreate = z.infer<typeof GroupSessionParticipantCreateSchema>;
export type GroupSessionParticipantUpdate = z.infer<typeof GroupSessionParticipantUpdateSchema>;
export type GroupStatistics = z.infer<typeof GroupStatisticsSchema>;
export type GroupRole = z.infer<typeof GroupRoleSchema>;
export type GroupType = z.infer<typeof GroupTypeSchema>;
export type GroupVisibility = z.infer<typeof GroupVisibilitySchema>;
export type MembershipStatus = z.infer<typeof MembershipStatusSchema>;
