import { getDb } from '@repo/data-ops/database/setup';
import {
  quizAttempts,
  quizQuestions,
} from '@repo/data-ops/drizzle/quizzes-schema';
import {
  chapters,
  flashcards,
  flashcardSessions,
  subjects,
  userFlashcardProgress,
  userProfiles,
  userProgress,
} from '@repo/data-ops/drizzle/schema';
import { createServerFn } from '@tanstack/react-start';
import { and, avg, count, desc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { protectedFunctionMiddleware } from '@/core/middleware/auth';

export const getDashboard = createServerFn()
  .middleware([protectedFunctionMiddleware])
  .handler(async (ctx) => {
    const db = getDb();
    const userId = ctx.context.userId;

    // Get user profile
    const [profile] = await db.select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    if (!profile) {
      throw new Error('Profile not found');
    }

    // Calculate exam countdown
    const examDate = new Date(profile.examDate || '');
    const daysRemaining = Math.ceil(
      (examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );

    // Get user subjects with progress using proper SQL aggregations
    const userSubjects = await db
      .select({
        id: subjects.id,
        name: subjects.name,
        shortName: subjects.shortName,
        coefficient: subjects.coefficient,
        totalChapters: count(chapters.id).as('total_chapters'),
        completedChapters: count(
          sql<number>`case when ${userProgress.isCompleted} then 1 else null end`,
        ).as('completed_chapters'),
        avgMastery: avg(userProgress.masteryPercentage).as('avg_mastery'),
        totalStudyTime: sql<number>`sum(${userProgress.timeSpentMinutes})`.as('total_study_time'),
      })
      .from(subjects)
      .innerJoin(chapters, eq(chapters.subjectId, subjects.id))
      .leftJoin(
        userProgress,
        and(
          eq(userProgress.chapterId, chapters.id),
          eq(userProgress.userId, userId),
        ),
      )
      .where(eq(subjects.grade, profile.grade))
      .groupBy(subjects.id);

    // Calculate overall readiness score
    const readinessScore = calculateReadinessScore(userSubjects);

    // Get study streak
    const lastStudyDate = profile.lastStudyDate ? new Date(profile.lastStudyDate) : null;
    const isStreakActive = lastStudyDate
      && (Date.now() - lastStudyDate.getTime()) < 48 * 60 * 60 * 1000;

    // Get recommended chapters (low mastery, not studied recently)
    const recommendations = await db
      .select({
        chapterId: chapters.id,
        chapterTitle: chapters.title,
        subjectId: subjects.id,
        subjectName: subjects.name,
        mastery: userProgress.masteryPercentage,
        lastStudied: userProgress.lastStudied,
        difficulty: chapters.difficulty,
      })
      .from(chapters)
      .innerJoin(subjects, eq(subjects.id, chapters.subjectId))
      .innerJoin(
        userProgress,
        and(
          eq(userProgress.chapterId, chapters.id),
          eq(userProgress.userId, userId),
        ),
      )
      .where(
        and(
          eq(subjects.grade, profile.grade),
          sql`${userProgress.masteryPercentage} < 70`,
        ),
      )
      .orderBy(
        userProgress.masteryPercentage,
        desc(userProgress.lastStudied),
      )
      .limit(3);

    // Get today's study time
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayStats = await db
      .select({
        totalMinutes: sql<number>`sum(${userProgress.timeSpentMinutes})`.as('total_minutes'),
        sessionsCount: count().as('sessions_count'),
      })
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, userId),
          sql`${userProgress.updatedAt} >= ${today}`,
        ),
      )
      .limit(1);

    // Get recent activity from flashcard sessions
    const recentSessions = await db
      .select({
        type: sql<'flashcard' | 'quiz'>`'flashcard'`.as('type'),
        subjectName: subjects.name,
        completedAt: flashcardSessions.completedAt,
        totalCards: flashcardSessions.totalCards,
        goodCount: flashcardSessions.goodCount,
        accuracyRate: flashcardSessions.accuracyRate,
      })
      .from(flashcardSessions)
      .innerJoin(chapters, eq(chapters.id, flashcardSessions.chapterId))
      .innerJoin(subjects, eq(subjects.id, chapters.subjectId))
      .where(eq(flashcardSessions.userId, userId))
      .orderBy(desc(flashcardSessions.completedAt))
      .limit(5);

    return {
      user: {
        name: ctx.context.email?.split('@')[0] || 'Étudiant',
        grade: profile.grade,
        series: profile.series,
        examDate,
      },
      examCountdown: {
        daysRemaining,
        weeksRemaining: Math.ceil(daysRemaining / 7),
      },
      studyStreak: {
        current: isStreakActive ? profile.studyStreak : 0,
        longest: profile.studyStreak,
        lastStudyDate,
      },
      todayGoal: {
        targetMinutes: profile.dailyStudyTime || 30,
        completedMinutes: Number(todayStats[0]?.totalMinutes) || 0,
        sessionsCount: Number(todayStats[0]?.sessionsCount) || 0,
      },
      readinessScore,
      recommendations: recommendations.map(r => ({
        subjectId: r.subjectId,
        subjectName: r.subjectName,
        chapterId: r.chapterId,
        chapterName: r.chapterTitle,
        reason: Number(r.mastery) < 30
          ? 'Faible maîtrise'
          : !r.lastStudied
              ? 'Non étudié'
              : 'Révision recommandée',
        masteryPercentage: Number(r.mastery),
      })),
      subjects: userSubjects.map(s => ({
        id: s.id,
        name: s.name,
        shortName: s.shortName,
        coefficient: s.coefficient,
        masteryPercentage: Math.round(Number(s.avgMastery) || 0),
        chaptersCompleted: Number(s.completedChapters),
        totalChapters: Number(s.totalChapters),
        totalStudyTime: Number(s.totalStudyTime) || 0,
      })),
      recentActivity: recentSessions.map(session => ({
        ...session,
        details: `${session.totalCards} cartes révisées${session.goodCount ? ` (${session.goodCount} correctes)` : ''}`,
      })),
    };
  });

function calculateReadinessScore(subjects: any[]): number {
  if (subjects.length === 0) { return 0; }

  const totalWeight = subjects.reduce((sum, s) => sum + s.coefficient, 0);
  const weightedScore = subjects.reduce((sum, s) => {
    return sum + (Number(s.avgMastery) || 0) * s.coefficient;
  }, 0);

  return Math.round(weightedScore / totalWeight);
}

const SubjectIdSchema = z.object({
  subjectId: z.number().int().positive(),
});

const ChapterIdSchema = z.object({
  chapterId: z.number().int().positive(),
});

export const getSubjectDetail = createServerFn()
  .middleware([protectedFunctionMiddleware])
  .inputValidator((data: z.infer<typeof SubjectIdSchema>) => SubjectIdSchema.parse(data))
  .handler(async (ctx) => {
    const db = getDb();
    const userId = ctx.context.userId;
    const { subjectId } = ctx.data;

    // Get subject info
    const [subject] = await db.select()
      .from(subjects)
      .where(eq(subjects.id, subjectId))
      .limit(1);

    if (!subject) {
      throw new Error('Subject not found');
    }

    // Get chapters with progress
    const chaptersWithProgress = await db.select({
      id: chapters.id,
      title: chapters.title,
      order: chapters.order,
      difficulty: chapters.difficulty,
      estimatedHours: chapters.estimatedHours,
      description: chapters.description,
      masteryPercentage: userProgress.masteryPercentage,
      chaptersCompleted: userProgress.isCompleted,
      lastStudied: userProgress.lastStudied,
      timeSpentMinutes: userProgress.timeSpentMinutes,
      flashcardCount: sql<number>`(
        select count(*) from ${flashcards}
        where ${flashcards.chapterId} = ${chapters.id}
      )`,
      quizQuestionCount: sql<number>`(
        select count(*) from ${quizQuestions}
        where ${quizQuestions.chapterId} = ${chapters.id}
      )`,
    })
      .from(chapters)
      .leftJoin(
        userProgress,
        and(
          eq(userProgress.chapterId, chapters.id),
          eq(userProgress.userId, userId),
        ),
      )
      .where(eq(chapters.subjectId, subjectId))
      .orderBy(chapters.order);

    // Calculate overall stats
    const totalChapters = chaptersWithProgress.length;
    const completedChapters = chaptersWithProgress.filter(c => c.chaptersCompleted).length;
    const avgMastery = totalChapters > 0
      ? chaptersWithProgress.reduce((sum, c) => sum + (Number(c.masteryPercentage) || 0), 0) / totalChapters
      : 0;
    const totalEstimatedHours = chaptersWithProgress.reduce((sum, c) =>
      sum + Number.parseFloat(c.estimatedHours?.toString() || '0'), 0);
    const lastStudied = chaptersWithProgress
      .filter(c => c.lastStudied)
      .sort((a, b) => b.lastStudied!.getTime() - a.lastStudied!.getTime())[0]
      ?.lastStudied;

    // Get recent quiz scores for performance chart
    const recentQuizzes = await db.select({
      score: quizAttempts.score,
      completedAt: quizAttempts.completedAt,
    })
      .from(quizAttempts)
      .innerJoin(chapters, eq(chapters.id, quizAttempts.chapterId))
      .where(
        and(
          eq(chapters.subjectId, subjectId),
          eq(quizAttempts.userId, userId),
          sql`${quizAttempts.completedAt} is not null`,
        ),
      )
      .orderBy(desc(quizAttempts.completedAt))
      .limit(5);

    return {
      id: subject.id,
      name: subject.name,
      shortName: subject.shortName,
      coefficient: subject.coefficient,
      totalChapters,
      completedChapters,
      masteryPercentage: Math.round(avgMastery),
      estimatedHoursRemaining: Math.round(totalEstimatedHours * (1 - avgMastery / 100)),
      lastStudied,
      chapters: chaptersWithProgress.map(c => ({
        id: c.id,
        title: c.title,
        order: c.order,
        difficulty: c.difficulty,
        estimatedHours: Number.parseFloat(c.estimatedHours?.toString() || '0'),
        description: c.description,
        flashcardCount: c.flashcardCount,
        quizQuestionCount: c.quizQuestionCount,
        isCompleted: c.chaptersCompleted || false,
        masteryPercentage: Math.round(Number(c.masteryPercentage) || 0),
        lastStudied: c.lastStudied,
        isStarted: (Number(c.masteryPercentage) || 0) > 0 || c.lastStudied !== null,
      })),
      recentQuizScores: recentQuizzes.map(q => Number(q.score) || 0),
    };
  });

export const getChapterModes = createServerFn()
  .middleware([protectedFunctionMiddleware])
  .inputValidator((data: z.infer<typeof ChapterIdSchema>) => ChapterIdSchema.parse(data))
  .handler(async (ctx) => {
    const db = getDb();
    const userId = ctx.context.userId;
    const { chapterId } = ctx.data;

    // Get chapter info
    const [chapter] = await db.select({
      id: chapters.id,
      title: chapters.title,
      subjectName: subjects.name,
      subjectId: subjects.id,
    })
      .from(chapters)
      .innerJoin(subjects, eq(subjects.id, chapters.subjectId))
      .where(eq(chapters.id, chapterId))
      .limit(1);

    if (!chapter) {
      throw new Error('Chapter not found');
    }

    // Get flashcard stats
    const [flashcardStats] = await db.select({
      total: sql<number>`count(*)`,
      mastered: sql<number>`count(case when ${userFlashcardProgress.repetitions} >= 3 then 1 end)`,
      review: sql<number>`count(case when ${userFlashcardProgress.nextReviewDate} <= now() then 1 end)`,
    })
      .from(flashcards)
      .leftJoin(
        userFlashcardProgress,
        and(
          eq(userFlashcardProgress.flashcardId, flashcards.id),
          eq(userFlashcardProgress.userId, userId),
        ),
      )
      .where(eq(flashcards.chapterId, chapterId));

    const newCards = flashcardStats.total - flashcardStats.mastered - flashcardStats.review;

    // Get quiz stats
    const [quizStats] = await db.select({
      totalQuestions: sql<number>`count(*)`,
    })
      .from(quizQuestions)
      .where(eq(quizQuestions.chapterId, chapterId));

    const [attemptStats] = await db.select({
      attempts: sql<number>`count(distinct ${quizAttempts.id})`,
      avgScore: sql<number>`avg(${quizAttempts.score})`,
      lastAttempt: sql<Date>`max(${quizAttempts.completedAt})`,
    })
      .from(quizAttempts)
      .where(
        and(
          eq(quizAttempts.chapterId, chapterId),
          eq(quizAttempts.userId, userId),
          sql`${quizAttempts.completedAt} is not null`,
        ),
      );

    const attemptedQuestions = await db.select({
      count: sql<number>`count(distinct ${quizAttempts.userId})`,
    })
      .from(quizAttempts)
      .innerJoin(quizQuestions, eq(quizQuestions.id, quizAttempts.id))
      .where(
        and(
          eq(quizAttempts.chapterId, chapterId),
          eq(quizAttempts.userId, userId),
        ),
      );

    return {
      chapter: {
        id: chapter.id,
        title: chapter.title,
        subjectName: chapter.subjectName,
        subjectId: chapter.subjectId,
      },
      flashcardStats: {
        total: flashcardStats.total,
        newCards,
        reviewCards: flashcardStats.review,
        masteredCards: flashcardStats.mastered,
        estimatedMinutes: Math.ceil(flashcardStats.total / 10), // ~6 cards per minute
      },
      quizStats: {
        totalQuestions: quizStats.totalQuestions,
        attemptedQuestions: attemptedQuestions[0]?.count || 0,
        attempts: attemptStats?.attempts || 0,
        averageScore: attemptStats?.avgScore ? Math.round(Number(attemptStats.avgScore)) : null,
        lastAttemptDate: attemptStats?.lastAttempt || null,
        estimatedMinutes: Math.ceil(quizStats.totalQuestions * 1.5), // ~40 seconds per question
      },
    };
  });
