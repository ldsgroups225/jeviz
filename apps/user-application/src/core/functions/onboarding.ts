import type { SQL } from 'drizzle-orm';
import { getDb } from '@repo/data-ops/database/setup';
import {
  chapters,
  subjects,
  userProfiles,
  userProgress,
} from '@repo/data-ops/drizzle/schema';
import { createServerFn } from '@tanstack/react-start';
import { and, eq, inArray, isNull, like, or } from 'drizzle-orm';
import { z } from 'zod';

const OnboardingSchema = z.object({
  grade: z.enum(['3ème', 'Terminale']),
  series: z.enum(['A', 'C', 'D', 'E', 'G']).optional(),
  secondLanguage: z.enum(['ALL', 'ESP']).optional(),
});

type OnboardingInput = z.infer<typeof OnboardingSchema>;

export const completeOnboarding = createServerFn()
  .inputValidator((data: OnboardingInput) => OnboardingSchema.parse(data))
  .handler(async (ctx) => {
    const db = getDb();
    const { grade, series, secondLanguage } = ctx.data;
    const userId = (ctx.context as any)?.userId;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    // 1. Create or update user profile
    await db.insert(userProfiles)
      .values({
        userId,
        grade,
        series: series || null,
        secondLanguage: secondLanguage || null,
        examDate: calculateExamDate().toISOString(),
        onboardingComplete: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [userProfiles.userId],
        set: {
          grade,
          series: series || null,
          secondLanguage: secondLanguage || null,
          onboardingComplete: true,
          updatedAt: new Date(),
        },
      });

    // 2. Get relevant subjects for the user
    let subjectFilter: SQL<unknown> = eq(subjects.grade, grade);

    if (grade === 'Terminale' && series) {
      // For Terminale, filter by series or core subjects
      subjectFilter = and(
        eq(subjects.grade, grade),
        or(
          like(subjects.series, `%${series}%`),
          isNull(subjects.series), // Core subjects
        ),
      )!;
    }

    const relevantSubjects = await db.select()
      .from(subjects)
      .where(subjectFilter);

    // 3. Filter language choices if applicable
    const filteredSubjects = relevantSubjects.filter((subject) => {
      // If it's a language choice subject
      if (subject.languageChoice) {
        // Include only if it matches the selected language
        if (secondLanguage === 'ALL' && subject.shortName === 'ALL') { return true; }
        if (secondLanguage === 'ESP' && subject.shortName === 'ESP') { return true; }
        return false;
      }
      return true;
    });

    // 4. Create initial progress records for all chapters
    const chapterIds = await db
      .select({ id: chapters.id })
      .from(chapters)
      .where(inArray(chapters.subjectId, filteredSubjects.map(s => s.id)));

    if (chapterIds.length > 0) {
      await db.insert(userProgress)
        .values(
          chapterIds.map(({ id }) => ({
            userId,
            chapterId: id,
            masteryPercentage: '0',
            confidenceLevel: '0.5',
            isStarted: false,
            isCompleted: false,
            timeSpentMinutes: 0,
            studySessions: 0,
            flashcardProgress: '0',
            quizProgress: '0',
            practiceProgress: '0',
            averageQuizScore: null,
            bestQuizScore: null,
            flashcardRetentionRate: null,
            nextReviewDate: null,
            totalReviews: 0,
            correctReviews: 0,
            targetMastery: '80',
            currentDifficulty: 'moyen',
            adaptiveDifficulty: true,
            currentStreak: 0,
            longestStreak: 0,
            qualityScore: '0',
            engagementScore: '0',
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
        )
        .onConflictDoNothing(); // Skip if already exists
    }

    return {
      success: true,
      subjectCount: filteredSubjects.length,
      grade,
      series,
      secondLanguage,
    };
  });

function calculateExamDate(): Date {
  const now = new Date();
  const currentYear = now.getFullYear();
  const month = now.getMonth();

  // Exams are typically in June
  // If we're past June, target next year
  const targetYear = month >= 6 ? currentYear + 1 : currentYear;

  return new Date(targetYear, 5, 15); // June 15th
}
