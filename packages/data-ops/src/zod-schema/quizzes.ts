import { z } from 'zod';

// Enums
export const QuestionTypeSchema = z.enum([
  'multiple_choice',
  'true_false',
  'fill_blank',
  'short_answer',
  'essay',
  'matching',
  'ordering',
]);

export const QuizDifficultySchema = z.enum(['facile', 'moyen', 'difficile']);
export const QuizStatusSchema = z.enum(['draft', 'active', 'archived']);
export const QuizTypeSchema = z.enum(['practice', 'test', 'review']);

// Quiz question schemas
export const QuizQuestionCreateSchema = z.object({
  chapterId: z.number().int().positive('L\'ID du chapitre est requis'),
  type: QuestionTypeSchema,
  question: z.string().min(1, 'La question est requise').max(2000, 'La question ne peut pas dépasser 2000 caractères'),
  imageUrl: z.string().url('L\'URL de l\'image doit être valide').optional(),
  audioUrl: z.string().url('L\'URL de l\'audio doit être valide').optional(),
  videoUrl: z.string().url('L\'URL de la vidéo doit être valide').optional(),
  options: z.array(z.string().max(500, 'Chaque option ne peut pas dépasser 500 caractères')).optional(),
  correctAnswer: z.string().min(1, 'La réponse correcte est requise').max(1000, 'La réponse correcte ne peut pas dépasser 1000 caractères'),
  explanation: z.string().max(2000, 'L\'explication ne peut pas dépasser 2000 caractères').optional(),
  hints: z.array(z.string().max(300, 'Chaque indice ne peut pas dépasser 300 caractères')).optional(),
  points: z.number().int().min(1, 'Les points doivent être au moins 1').max(10, 'Les points ne peuvent pas dépasser 10').default(1),
  difficulty: QuizDifficultySchema.default('moyen'),
  order: z.number().int().min(1, 'L\'ordre doit être au moins 1'),
  tags: z.array(z.string().max(50, 'Chaque tag ne peut pas dépasser 50 caractères')).optional(),
  estimatedTime: z.number().int().min(10, 'Le temps estimé doit être au moins 10 secondes').max(1800, 'Le temps estimé ne peut pas dépasser 30 minutes').optional(),
  isActive: z.boolean().default(true),
  status: QuizStatusSchema.default('active'),
});

export const QuizQuestionUpdateSchema = QuizQuestionCreateSchema.partial();

export const QuizQuestionFilterSchema = z.object({
  chapterId: z.number().int().positive().optional(),
  type: QuestionTypeSchema.optional(),
  difficulty: QuizDifficultySchema.optional(),
  status: QuizStatusSchema.optional(),
  points: z.object({
    min: z.number().int().min(1).optional(),
    max: z.number().int().max(10).optional(),
  }).optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().optional(),
  hasImage: z.boolean().optional(),
  hasAudio: z.boolean().optional(),
});

// Quiz attempt schemas
export const QuizAttemptCreateSchema = z.object({
  userId: z.string().min(1, 'L\'ID utilisateur est requis'),
  chapterId: z.number().int().positive('L\'ID du chapitre est requis').optional(),
  quizType: QuizTypeSchema.default('practice'),
  questionCount: z.number().int().min(1, 'Le nombre de questions doit être au moins 1').max(100, 'Le nombre de questions ne peut pas dépasser 100'),
  timeLimit: z.number().int().min(5, 'La limite de temps doit être au moins 5 minutes').max(180, 'La limite de temps ne peut pas dépasser 3 heures').optional(),
  shuffleQuestions: z.boolean().default(false),
  shuffleOptions: z.boolean().default(true),
});

export const QuizAttemptUpdateSchema = z.object({
  completedAt: z.string().datetime().optional(),
  lastActivityAt: z.string().datetime().optional(),
  score: z.number().min(0).max(100).optional(),
  totalPoints: z.number().int().min(0).optional(),
  earnedPoints: z.number().int().min(0).optional(),
  correctAnswers: z.number().int().min(0).optional(),
  incorrectAnswers: z.number().int().min(0).optional(),
  skippedAnswers: z.number().int().min(0).optional(),
  totalResponseTime: z.number().int().min(0).optional(),
  averageResponseTime: z.number().int().min(0).optional(),
  accuracyRate: z.number().min(0).max(100).optional(),
  status: z.enum(['active', 'completed', 'abandoned', 'paused']).optional(),
  currentQuestionIndex: z.number().int().min(0).optional(),
  progressPercentage: z.number().min(0).max(100).optional(),
  reviewMode: z.boolean().optional(),
  reviewStartedAt: z.string().datetime().optional(),
  reviewCompletedAt: z.string().datetime().optional(),
});

// Quiz answer schemas
export const QuizAnswerCreateSchema = z.object({
  attemptId: z.string().min(1, 'L\'ID de tentative est requis'),
  questionId: z.number().int().positive('L\'ID de question est requis'),
  questionSnapshot: z.string().min(1, 'L\'instantané de question est requis'),
  optionsSnapshot: z.array(z.string()).optional(),
  correctAnswerSnapshot: z.string().min(1, 'L\'instantané de réponse correcte est requis'),
  userAnswer: z.string().min(1, 'La réponse utilisateur est requise'),
  isCorrect: z.boolean(),
  selectedOptions: z.array(z.string()).optional(),
  questionStartedAt: z.string().datetime('La date de début de question est requise'),
  answeredAt: z.string().datetime('La date de réponse est requise'),
  responseTime: z.number().int().min(0, 'Le temps de réponse ne peut pas être négatif'),
  hintsUsed: z.number().int().min(0).default(0),
  wasSkipped: z.boolean().default(false),
  wasFlagged: z.boolean().default(false),
  attempts: z.number().int().min(1).default(1),
});

export const QuizAnswerUpdateSchema = z.object({
  reviewed: z.boolean().optional(),
  reviewedAt: z.string().datetime().optional(),
  userNote: z.string().max(500, 'La note utilisateur ne peut pas dépasser 500 caractères').optional(),
});

// Quiz template schemas
export const QuizTemplateCreateSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  description: z.string().max(500, 'La description ne peut pas dépasser 500 caractères').optional(),
  chapterId: z.number().int().positive('L\'ID du chapitre est requis').optional(),
  quizType: QuizTypeSchema.default('practice'),
  questionCount: z.number().int().min(1, 'Le nombre de questions doit être au moins 1').max(100, 'Le nombre de questions ne peut pas dépasser 100'),
  timeLimit: z.number().int().min(5).max(180).optional(),
  shuffleQuestions: z.boolean().default(false),
  shuffleOptions: z.boolean().default(true),
  difficultyFilter: z.array(QuizDifficultySchema).optional(),
  tagsFilter: z.array(z.string()).optional(),
  pointsRange: z.object({
    min: z.number().int().min(1).optional(),
    max: z.number().int().max(10).optional(),
  }).optional(),
  passingScore: z.number().min(0).max(100).optional(),
  maxAttempts: z.number().int().min(1).optional(),
  cooldownPeriod: z.number().int().min(0).optional(), // hours
  sortOrder: z.number().int().min(0).default(0),
});

export const QuizTemplateUpdateSchema = QuizTemplateCreateSchema.partial();

// Quiz configuration schemas
export const QuizConfigSchema = z.object({
  chapterId: z.number().int().positive().optional(),
  questionCount: z.number().int().min(1).max(50).default(20),
  timeLimit: z.number().int().min(5).max(120).optional(),
  difficulty: z.enum(['mixed', 'facile', 'moyen', 'difficile']).default('mixed'),
  questionTypes: z.array(QuestionTypeSchema).default(['multiple_choice', 'true_false']),
  shuffleQuestions: z.boolean().default(true),
  shuffleOptions: z.boolean().default(true),
  showProgress: z.boolean().default(true),
  allowReview: z.boolean().default(true),
  showCorrectAnswers: z.boolean().default(true),
  showExplanations: z.boolean().default(true),
  allowSkipping: z.boolean().default(true),
});

// Quiz result schemas
export const QuizResultSchema = z.object({
  attemptId: z.string(),
  score: z.number().min(0).max(100),
  totalPoints: z.number().int().min(0),
  earnedPoints: z.number().int().min(0),
  correctAnswers: z.number().int().min(0),
  totalQuestions: z.number().int().min(0),
  accuracyRate: z.number().min(0).max(100),
  averageResponseTime: z.number().int().min(0),
  totalTime: z.number().int().min(0),
  completedAt: z.string().datetime(),
  grade: z.enum(['A', 'B', 'C', 'D', 'F']).optional(),
  feedback: z.string().optional(),
});

// Quiz statistics schemas
export const QuizStatisticsSchema = z.object({
  totalAttempts: z.number().int().min(0),
  averageScore: z.number().min(0).max(100),
  bestScore: z.number().min(0).max(100),
  averageResponseTime: z.number().int().min(0),
  difficultyBreakdown: z.object({
    facile: z.object({
      attempts: z.number().int().min(0),
      averageScore: z.number().min(0).max(100),
    }),
    moyen: z.object({
      attempts: z.number().int().min(0),
      averageScore: z.number().min(0).max(100),
    }),
    difficile: z.object({
      attempts: z.number().int().min(0),
      averageScore: z.number().min(0).max(100),
    }),
  }),
  typeBreakdown: z.record(z.string(), z.object({
    attempts: z.number().int().min(0),
    averageScore: z.number().min(0).max(100),
  })),
});

// Validation functions
export function validateQuizQuestion(data: unknown) {
  return QuizQuestionCreateSchema.safeParse(data);
}

export function validateQuizAttempt(data: unknown) {
  return QuizAttemptCreateSchema.safeParse(data);
}

export function validateQuizAnswer(data: unknown) {
  return QuizAnswerCreateSchema.safeParse(data);
}

export function validateQuizConfig(data: unknown) {
  return QuizConfigSchema.safeParse(data);
}

export function validateQuizTemplate(data: unknown) {
  return QuizTemplateCreateSchema.safeParse(data);
}

// Type exports
export type QuizQuestionCreate = z.infer<typeof QuizQuestionCreateSchema>;
export type QuizQuestionUpdate = z.infer<typeof QuizQuestionUpdateSchema>;
export type QuizQuestionFilter = z.infer<typeof QuizQuestionFilterSchema>;
export type QuizAttemptCreate = z.infer<typeof QuizAttemptCreateSchema>;
export type QuizAttemptUpdate = z.infer<typeof QuizAttemptUpdateSchema>;
export type QuizAnswerCreate = z.infer<typeof QuizAnswerCreateSchema>;
export type QuizAnswerUpdate = z.infer<typeof QuizAnswerUpdateSchema>;
export type QuizTemplateCreate = z.infer<typeof QuizTemplateCreateSchema>;
export type QuizTemplateUpdate = z.infer<typeof QuizTemplateUpdateSchema>;
export type QuizConfig = z.infer<typeof QuizConfigSchema>;
export type QuizResult = z.infer<typeof QuizResultSchema>;
export type QuizStatistics = z.infer<typeof QuizStatisticsSchema>;
export type QuestionType = z.infer<typeof QuestionTypeSchema>;
export type QuizDifficulty = z.infer<typeof QuizDifficultySchema>;
export type QuizStatus = z.infer<typeof QuizStatusSchema>;
export type QuizType = z.infer<typeof QuizTypeSchema>;
