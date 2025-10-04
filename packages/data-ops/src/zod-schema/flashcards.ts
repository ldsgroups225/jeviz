import { z } from 'zod';

// Flashcard quality (SM-2 algorithm)
export const FlashcardQualitySchema = z.enum(['again', 'hard', 'good', 'easy']);
export const QualityNumberSchema = z.number().int().min(0).max(5); // 0-5 scale

// Flashcard schemas
export const FlashcardCreateSchema = z.object({
  chapterId: z.number().int().positive('L\'ID du chapitre est requis'),
  front: z.string().min(1, 'Le recto est requis').max(500, 'Le recto ne peut pas dépasser 500 caractères'),
  back: z.string().min(1, 'Le verso est requis').max(1000, 'Le verso ne peut pas dépasser 1000 caractères'),
  example: z.string().max(500, 'L\'exemple ne peut pas dépasser 500 caractères').optional(),
  imageUrl: z.string().url('L\'URL de l\'image doit être valide').optional(),
  audioUrl: z.string().url('L\'URL de l\'audio doit être valide').optional(),
  tags: z.array(z.string().max(50, 'Chaque tag ne peut pas dépasser 50 caractères')).optional(),
  difficulty: z.number().min(0, 'La difficulté doit être entre 0 et 1').max(1, 'La difficulté doit être entre 0 et 1').default(0.5),
  isActive: z.boolean().default(true),
});

export const FlashcardUpdateSchema = FlashcardCreateSchema.partial();

export const FlashcardFilterSchema = z.object({
  chapterId: z.number().int().positive().optional(),
  tags: z.array(z.string()).optional(),
  difficulty: z.object({
    min: z.number().min(0).max(1).optional(),
    max: z.number().min(0).max(1).optional(),
  }).optional(),
  search: z.string().optional(),
  hasImage: z.boolean().optional(),
  hasAudio: z.boolean().optional(),
});

// User flashcard progress schemas
export const UserFlashcardProgressCreateSchema = z.object({
  userId: z.string().min(1, 'L\'ID utilisateur est requis'),
  flashcardId: z.number().int().positive('L\'ID de la flashcard est requis'),
  easeFactor: z.number().min(1.3, 'Le facteur de facilité doit être au moins 1.3').max(2.5, 'Le facteur de facilité initial ne peut pas dépasser 2.5').default(2.5),
  interval: z.number().int().min(1, 'L\'intervalle doit être au moins 1 jour').default(1),
  repetitions: z.number().int().min(0, 'Les répétitions ne peuvent pas être négatives').default(0),
  nextReviewDate: z.string().datetime('La date de révision doit être une date valide').optional(),
  isSuspended: z.boolean().default(false),
  isBuried: z.boolean().default(false),
  note: z.string().max(500, 'La note ne peut pas dépasser 500 caractères').optional(),
});

export const UserFlashcardProgressUpdateSchema = UserFlashcardProgressCreateSchema.partial().extend({
  totalReviews: z.number().int().min(0).optional(),
  correctReviews: z.number().int().min(0).optional(),
  averageResponseTime: z.number().int().min(0).optional(),
  againCount: z.number().int().min(0).optional(),
  hardCount: z.number().int().min(0).optional(),
  goodCount: z.number().int().min(0).optional(),
  easyCount: z.number().int().min(0).optional(),
});

// Flashcard session schemas
export const FlashcardSessionCreateSchema = z.object({
  userId: z.string().min(1, 'L\'ID utilisateur est requis'),
  chapterId: z.number().int().positive('L\'ID du chapitre est requis').optional(),
  sessionType: z.enum(['review', 'learn', 'test']).default('review'),
  maxCards: z.number().int().min(1, 'Le nombre maximum de cartes doit être au moins 1').max(200, 'Le nombre maximum de cartes ne peut pas dépasser 200').optional(),
  timeLimit: z.number().int().min(5, 'La limite de temps doit être au moins 5 minutes').max(180, 'La limite de temps ne peut pas dépasser 3 heures').optional(),
});

export const FlashcardSessionUpdateSchema = z.object({
  completedAt: z.string().datetime().optional(),
  pausedAt: z.string().datetime().optional(),
  totalPausedTime: z.number().int().min(0).optional(),
  totalCards: z.number().int().min(0).optional(),
  newCards: z.number().int().min(0).optional(),
  learningCards: z.number().int().min(0).optional(),
  reviewCards: z.number().int().min(0).optional(),
  againCount: z.number().int().min(0).optional(),
  hardCount: z.number().int().min(0).optional(),
  goodCount: z.number().int().min(0).optional(),
  easyCount: z.number().int().min(0).optional(),
  averageResponseTime: z.number().int().min(0).optional(),
  accuracyRate: z.number().min(0).max(100).optional(),
  status: z.enum(['active', 'completed', 'abandoned']).optional(),
  currentCardIndex: z.number().int().min(0).optional(),
});

// Flashcard response schemas
export const FlashcardResponseCreateSchema = z.object({
  sessionId: z.string().min(1, 'L\'ID de session est requis'),
  flashcardId: z.number().int().positive('L\'ID de la flashcard est requis'),
  quality: QualityNumberSchema.refine(val => val >= 0 && val <= 5, {
    message: 'La qualité doit être entre 0 et 5',
  }),
  responseTime: z.number().int().min(0, 'Le temps de réponse ne peut pas être négatif'),
  previousInterval: z.number().int().min(0).optional(),
  previousEaseFactor: z.number().min(1.3).optional(),
  previousRepetitions: z.number().int().min(0).optional(),
  wasShown: z.boolean().default(true),
  wasSkipped: z.boolean().default(false),
});

export const FlashcardResponseUpdateSchema = z.object({
  newInterval: z.number().int().min(1).optional(),
  newEaseFactor: z.number().min(1.3).optional(),
  newRepetitions: z.number().int().min(0).optional(),
  nextReviewDate: z.string().datetime().optional(),
});

// SM-2 Algorithm input/output schemas
export const SM2InputSchema = z.object({
  quality: QualityNumberSchema,
  easeFactor: z.number().min(1.3),
  interval: z.number().int().min(1),
  repetitions: z.number().int().min(0),
});

export const SM2OutputSchema = z.object({
  newEaseFactor: z.number().min(1.3),
  newInterval: z.number().int().min(1),
  newRepetitions: z.number().int().min(0),
});

// Study session configuration schemas
export const StudySessionConfigSchema = z.object({
  chapterId: z.number().int().positive().optional(),
  cardTypes: z.array(z.enum(['new', 'learning', 'review'])).default(['review', 'learning', 'new']),
  maxNewCards: z.number().int().min(0).max(50).default(10),
  maxReviewCards: z.number().int().min(0).max(200).default(100),
  timeLimit: z.number().int().min(5).max(180).optional(),
  difficulty: z.enum(['easy', 'normal', 'hard']).default('normal'),
  tags: z.array(z.string()).optional(),
});

// Flashcard review statistics
export const FlashcardReviewStatsSchema = z.object({
  totalCards: z.number().int().min(0),
  correctCards: z.number().int().min(0),
  averageResponseTime: z.number().int().min(0),
  qualityDistribution: z.object({
    again: z.number().int().min(0),
    hard: z.number().int().min(0),
    good: z.number().int().min(0),
    easy: z.number().int().min(0),
  }),
  studyTime: z.number().int().min(0), // milliseconds
});

// Validation functions
export function validateFlashcard(data: unknown) {
  return FlashcardCreateSchema.safeParse(data);
}

export function validateFlashcardProgress(data: unknown) {
  return UserFlashcardProgressCreateSchema.safeParse(data);
}

export function validateFlashcardResponse(data: unknown) {
  return FlashcardResponseCreateSchema.safeParse(data);
}

export function validateStudySessionConfig(data: unknown) {
  return StudySessionConfigSchema.safeParse(data);
}

export function validateSM2Input(data: unknown) {
  return SM2InputSchema.safeParse(data);
}

// Type exports
export type FlashcardCreate = z.infer<typeof FlashcardCreateSchema>;
export type FlashcardUpdate = z.infer<typeof FlashcardUpdateSchema>;
export type FlashcardFilter = z.infer<typeof FlashcardFilterSchema>;
export type UserFlashcardProgressCreate = z.infer<typeof UserFlashcardProgressCreateSchema>;
export type UserFlashcardProgressUpdate = z.infer<typeof UserFlashcardProgressUpdateSchema>;
export type FlashcardSessionCreate = z.infer<typeof FlashcardSessionCreateSchema>;
export type FlashcardSessionUpdate = z.infer<typeof FlashcardSessionUpdateSchema>;
export type FlashcardResponseCreate = z.infer<typeof FlashcardResponseCreateSchema>;
export type FlashcardResponseUpdate = z.infer<typeof FlashcardResponseUpdateSchema>;
export type SM2Input = z.infer<typeof SM2InputSchema>;
export type SM2Output = z.infer<typeof SM2OutputSchema>;
export type StudySessionConfig = z.infer<typeof StudySessionConfigSchema>;
export type FlashcardQuality = z.infer<typeof FlashcardQualitySchema>;
