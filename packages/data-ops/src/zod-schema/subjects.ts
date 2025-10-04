import { z } from 'zod';

// Enums
export const GradeSchema = z.enum(['3ème', 'Terminale']);
export const SeriesSchema = z.enum(['A', 'C', 'D', 'E', 'G']);
export const ExamFormatSchema = z.enum(['écrit', 'pratique', 'oral']);
export const DifficultySchema = z.enum(['facile', 'moyen', 'difficile']);

// Subject schemas
export const SubjectCreateSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  shortName: z.string().min(1, 'Le nom court est requis').max(10, 'Le nom court ne peut pas dépasser 10 caractères'),
  grade: GradeSchema,
  series: z.array(SeriesSchema).optional(),
  coefficient: z.number().int().min(1, 'Le coefficient doit être au moins 1').max(10, 'Le coefficient ne peut pas dépasser 10'),
  examDuration: z.number().int().min(30, 'La durée doit être au moins 30 minutes').max(480, 'La durée ne peut pas dépasser 8 heures'),
  examFormat: ExamFormatSchema.default('écrit'),
  isCore: z.boolean().default(false),
  languageChoice: z.boolean().default(false),
  mutualExclusiveWith: z.number().int().positive().optional(),
  description: z.string().max(500, 'La description ne peut pas dépasser 500 caractères').optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'La couleur doit être un code hexadécimal valide').default('#3B82F6'),
  icon: z.string().max(50, 'Le nom de l\'icône ne peut pas dépasser 50 caractères').optional(),
});

export const SubjectUpdateSchema = SubjectCreateSchema.partial();

export const SubjectFilterSchema = z.object({
  grade: GradeSchema.optional(),
  series: SeriesSchema.optional(),
  isCore: z.boolean().optional(),
  languageChoice: z.boolean().optional(),
  search: z.string().optional(),
});

// Chapter schemas
export const ChapterCreateSchema = z.object({
  subjectId: z.number().int().positive('L\'ID du sujet est requis'),
  title: z.string().min(1, 'Le titre est requis').max(200, 'Le titre ne peut pas dépasser 200 caractères'),
  description: z.string().max(1000, 'La description ne peut pas dépasser 1000 caractères').optional(),
  order: z.number().int().min(1, 'L\'ordre doit être au moins 1'),
  estimatedHours: z.number().min(0.5, 'La durée estimée doit être au moins 0.5 heures').max(50, 'La durée estimée ne peut pas dépasser 50 heures').default(1),
  difficulty: DifficultySchema.default('moyen'),
  objectives: z.array(z.string().max(200, 'Chaque objectif ne peut pas dépasser 200 caractères')).optional(),
  prerequisites: z.array(z.string().max(200, 'Chaque prérequis ne peut pas dépasser 200 caractères')).optional(),
  isActive: z.boolean().default(true),
});

export const ChapterUpdateSchema = ChapterCreateSchema.partial();

export const ChapterFilterSchema = z.object({
  subjectId: z.number().int().positive().optional(),
  difficulty: DifficultySchema.optional(),
  isActive: z.boolean().optional(),
  search: z.string().optional(),
});

// User profile schemas
export const UserProfileCreateSchema = z.object({
  grade: GradeSchema,
  series: SeriesSchema.optional(),
  secondLanguage: z.enum(['ALL', 'ESP']).optional(),
  school: z.string().max(100, 'Le nom de l\'école ne peut pas dépasser 100 caractères').optional(),
  region: z.string().max(50, 'La région ne peut pas dépasser 50 caractères').optional(),
  examDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'La date doit être au format AAAA-MM-JJ').optional(),
  studyGoal: z.string().max(200, 'L\'objectif d\'étude ne peut pas dépasser 200 caractères').optional(),
  dailyStudyTime: z.number().int().min(10, 'Le temps d\'étude quotidien doit être au moins 10 minutes').max(480, 'Le temps d\'étude quotidien ne peut pas dépasser 8 heures').default(60),
  preferredStudyTime: z.enum(['morning', 'afternoon', 'evening']).optional(),
});

export const UserProfileUpdateSchema = UserProfileCreateSchema.partial().extend({
  studyStreak: z.number().int().min(0).optional(),
  lastStudyDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'La date doit être au format AAAA-MM-JJ').optional(),
  totalXP: z.number().int().min(0).optional(),
  level: z.number().int().min(1).optional(),
  currentXP: z.number().int().min(0).optional(),
  onboardingComplete: z.boolean().optional(),
  notificationsEnabled: z.boolean().optional(),
});

export const OnboardingSchema = z.object({
  grade: GradeSchema,
  series: SeriesSchema.optional(),
  secondLanguage: z.enum(['ALL', 'ESP']).optional(),
});

// Validation functions
export function validateOnboarding(data: unknown) {
  return OnboardingSchema.safeParse(data);
}

export function validateSubject(data: unknown) {
  return SubjectCreateSchema.safeParse(data);
}

export function validateChapter(data: unknown) {
  return ChapterCreateSchema.safeParse(data);
}

export function validateUserProfile(data: unknown) {
  return UserProfileCreateSchema.safeParse(data);
}

// Type exports
export type SubjectCreate = z.infer<typeof SubjectCreateSchema>;
export type SubjectUpdate = z.infer<typeof SubjectUpdateSchema>;
export type SubjectFilter = z.infer<typeof SubjectFilterSchema>;
export type ChapterCreate = z.infer<typeof ChapterCreateSchema>;
export type ChapterUpdate = z.infer<typeof ChapterUpdateSchema>;
export type ChapterFilter = z.infer<typeof ChapterFilterSchema>;
export type UserProfileCreate = z.infer<typeof UserProfileCreateSchema>;
export type UserProfileUpdate = z.infer<typeof UserProfileUpdateSchema>;
export type OnboardingData = z.infer<typeof OnboardingSchema>;
export type Grade = z.infer<typeof GradeSchema>;
export type Series = z.infer<typeof SeriesSchema>;
export type Difficulty = z.infer<typeof DifficultySchema>;
