import { getDb } from '@repo/data-ops/database/setup';
import {
  chapters,
  flashcardSessions,
  subjects,
  userProfiles,
  userProgress,
} from '@repo/data-ops/drizzle/schema';
import { createServerFn } from '@tanstack/react-start';
import { and, avg, count, desc, eq, sql } from 'drizzle-orm';
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
