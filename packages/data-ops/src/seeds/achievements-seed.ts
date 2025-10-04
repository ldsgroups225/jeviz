// Type imports from drizzle schema
import type {
  achievements,
} from '@/drizzle/gamification-schema';
// Achievements seed data for Jeviz gamification
import { getDb } from '@/database/setup';

import {
  achievements as achievementTable,
  levels,
} from '@/drizzle/gamification-schema';

const achievementData: Omit<typeof achievements.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Study streak achievements
  {
    title: 'Premier Jour',
    description: 'Complète ta première session d\'étude',
    shortDescription: 'Commence ton parcours d\'apprentissage',
    icon: '🎯',
    rarity: 'common' as const,
    type: 'study_streak' as const,
    category: 'engagement',
    requirement: { streak: 1 },
    requirementDescription: 'Étudie pendant 1 jour consécutif',
    xpReward: 10,
    titleReward: 'Débutant',
    isProgressive: false,
    progressSteps: null,
  },
  {
    title: 'Week-end Warrior',
    description: 'Maintiens un streak de 7 jours',
    shortDescription: 'Une semaine d\'étude consécutive',
    icon: '🔥',
    rarity: 'uncommon' as const,
    type: 'study_streak' as const,
    category: 'engagement',
    requirement: { streak: 7 },
    requirementDescription: 'Étudie pendant 7 jours consécutifs',
    xpReward: 100,
    titleReward: 'Déterminé',
    isProgressive: true,
    progressSteps: 7,
  },
  {
    title: 'Marathonien',
    description: 'Maintiens un streak de 30 jours',
    shortDescription: 'Un mois d\'apprentissage ininterrompu',
    icon: '🏃‍♂️',
    rarity: 'rare' as const,
    type: 'study_streak' as const,
    category: 'engagement',
    requirement: { streak: 30 },
    requirementDescription: 'Étudie pendant 30 jours consécutifs',
    xpReward: 500,
    titleReward: 'Marathonien',
    isProgressive: true,
    progressSteps: 30,
  },
  {
    title: 'Légende du Streak',
    description: 'Maintiens un streak de 100 jours',
    shortDescription: '100 jours d\'excellence',
    icon: '👑',
    rarity: 'legendary' as const,
    type: 'study_streak' as const,
    category: 'engagement',
    requirement: { streak: 100 },
    requirementDescription: 'Étudie pendant 100 jours consécutifs',
    xpReward: 2000,
    titleReward: 'Légende',
    badgeReward: 'gold_badge_100',
    isProgressive: true,
    progressSteps: 100,
  },

  // Subject mastery achievements
  {
    title: 'Mathématicien en Herbe',
    description: 'Atteins 80% de maîtrise en Mathématiques 3ème',
    shortDescription: 'Excellence en mathématiques',
    icon: '📐',
    rarity: 'uncommon' as const,
    type: 'subject_mastery' as const,
    category: 'académique',
    requirement: { subject: 'MATH', mastery: 80, grade: '3ème' },
    requirementDescription: '80% de maîtrise en Mathématiques 3ème',
    xpReward: 150,
    titleReward: 'Expert en Maths',
    isProgressive: true,
    progressSteps: 8,
  },
  {
    title: 'Littéraire',
    description: 'Atteins 80% de maîtrise en Français 3ème',
    shortDescription: 'Maîtrise de la langue française',
    icon: '📚',
    rarity: 'uncommon' as const,
    type: 'subject_mastery' as const,
    category: 'académique',
    requirement: { subject: 'FR', mastery: 80, grade: '3ème' },
    requirementDescription: '80% de maîtrise en Français 3ème',
    xpReward: 150,
    titleReward: 'Littéraire',
    isProgressive: true,
    progressSteps: 8,
  },
  {
    title: 'Scientifique accompli',
    description: 'Atteins 80% de maîtrise dans toutes les matières scientifiques',
    shortDescription: 'Excellence en sciences',
    icon: '🔬',
    rarity: 'epic' as const,
    type: 'subject_mastery' as const,
    category: 'académique',
    requirement: { subjects: ['MATH', 'PC', 'SVT'], mastery: 80 },
    requirementDescription: '80% de maîtrise en Math, PC, et SVT',
    xpReward: 500,
    titleReward: 'Scientifique',
    isProgressive: false,
    progressSteps: null,
  },

  // Quiz achievements
  {
    title: 'Quizzeur du jour',
    description: 'Obtiens 100% à un quiz',
    shortDescription: 'Score parfait',
    icon: '✨',
    rarity: 'common' as const,
    type: 'quiz_score' as const,
    category: 'performance',
    requirement: { score: 100 },
    requirementDescription: 'Obtenir 100% à un quiz',
    xpReward: 25,
    isRepeatable: true,
    maxCompletions: 10,
    isProgressive: false,
    progressSteps: null,
  },
  {
    title: 'Maître des Quizzes',
    description: 'Obtiens 100% à 10 quizzes différents',
    shortDescription: 'Consistance dans l\'excellence',
    icon: '🏆',
    rarity: 'rare' as const,
    type: 'quiz_score' as const,
    category: 'performance',
    requirement: { perfectQuizzes: 10 },
    requirementDescription: '10 scores parfaits à des quiz',
    xpReward: 300,
    titleReward: 'Quiz Master',
    isProgressive: true,
    progressSteps: 10,
  },

  // Flashcard achievements
  {
    title: 'Apprenti des cartes',
    description: 'Maîtrise tes 100 premières flashcards',
    shortDescription: '100 cartes maîtrisées',
    icon: '🃏',
    rarity: 'common' as const,
    type: 'flashcard_mastery' as const,
    category: 'mémorisation',
    requirement: { masteredCards: 100 },
    requirementDescription: 'Maîtriser 100 flashcards',
    xpReward: 50,
    isProgressive: true,
    progressSteps: 10,
  },
  {
    title: 'Mémorisation de masse',
    description: 'Maîtrise 1000 flashcards',
    shortDescription: '1000 cartes dans ta tête',
    icon: '🧠',
    rarity: 'epic' as const,
    type: 'flashcard_mastery' as const,
    category: 'mémorisation',
    requirement: { masteredCards: 1000 },
    requirementDescription: 'Maîtriser 1000 flashcards',
    xpReward: 1000,
    titleReward: 'Mémorisateur',
    isProgressive: true,
    progressSteps: 20,
  },

  // Milestone achievements
  {
    title: 'Niveau 5 Atteint',
    description: 'Atteins le niveau 5',
    shortDescription: 'Premier palier important',
    icon: '⭐',
    rarity: 'common' as const,
    type: 'milestone' as const,
    category: 'progression',
    requirement: { level: 5 },
    requirementDescription: 'Atteindre le niveau 5',
    xpReward: 50,
    isProgressive: false,
    progressSteps: null,
  },
  {
    title: 'Niveau 10 Atteint',
    description: 'Atteins le niveau 10',
    shortDescription: 'Milestone intermédiaire',
    icon: '⭐⭐',
    rarity: 'uncommon' as const,
    type: 'milestone' as const,
    category: 'progression',
    requirement: { level: 10 },
    requirementDescription: 'Atteindre le niveau 10',
    xpReward: 150,
    titleReward: 'Étudiant Avancé',
    isProgressive: false,
    progressSteps: null,
  },
  {
    title: 'Niveau 25 Atteint',
    description: 'Atteins le niveau 25',
    shortDescription: 'Milestone significatif',
    icon: '🌟',
    rarity: 'rare' as const,
    type: 'milestone' as const,
    category: 'progression',
    requirement: { level: 25 },
    requirementDescription: 'Atteindre le niveau 25',
    xpReward: 500,
    titleReward: 'Expert',
    isProgressive: false,
    progressSteps: null,
  },
  {
    title: 'Niveau 50 Atteint',
    description: 'Atteins le niveau 50',
    shortDescription: 'Milestone majeur',
    icon: '🌠',
    rarity: 'epic' as const,
    type: 'milestone' as const,
    category: 'progression',
    requirement: { level: 50 },
    requirementDescription: 'Atteindre le niveau 50',
    xpReward: 1500,
    titleReward: 'Maître',
    badgeReward: 'expert_badge_50',
    isProgressive: false,
    progressSteps: null,
  },

  // Time-based achievements
  {
    title: 'Marathon d\'étude',
    description: 'Étudie pendant 3 heures d\'affilée',
    shortDescription: 'Session marathon',
    icon: '⏰',
    rarity: 'uncommon' as const,
    type: 'time_based' as const,
    category: 'engagement',
    requirement: { continuousMinutes: 180 },
    requirementDescription: '3 heures d\'étude continue',
    xpReward: 100,
    titleReward: 'Marathonien',
    isProgressive: false,
    progressSteps: null,
  },
  {
    title: 'Nuit blanche d\'étude',
    description: 'Étudie pendant 8 heures en une journée',
    shortDescription: 'Journée d\'étude intense',
    icon: '🌙',
    rarity: 'epic' as const,
    type: 'time_based' as const,
    category: 'engagement',
    requirement: { dailyMinutes: 480 },
    requirementDescription: '8 heures d\'étude en une journée',
    xpReward: 300,
    titleReward: 'Dévoué',
    isProgressive: false,
    progressSteps: null,
  },

  // Special achievements
  {
    title: 'Première Victoire',
    description: 'Obtiens ton premier succès',
    shortDescription: 'Commence ta collection',
    icon: '🎉',
    rarity: 'common' as const,
    type: 'special' as const,
    category: 'spécial',
    requirement: { firstAchievement: true },
    requirementDescription: 'Débloquer ton premier achievement',
    xpReward: 5,
    isProgressive: false,
    progressSteps: null,
  },
  {
    title: 'Collectionneur',
    description: 'Débloque 50 achievements',
    shortDescription: 'Collectionneur accompli',
    icon: '🏅',
    rarity: 'legendary' as const,
    type: 'special' as const,
    category: 'spécial',
    requirement: { totalAchievements: 50 },
    requirementDescription: 'Débloquer 50 achievements',
    xpReward: 2000,
    titleReward: 'Collectionneur',
    badgeReward: 'collector_badge',
    isProgressive: true,
    progressSteps: 10,
  },
];

// Level data
const levelData: Omit<typeof levels.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>[] = [
  { level: 1, xpRequired: 0, xpRangeStart: 0, xpRangeEnd: 49, tier: 'beginner' as const, title: 'Débutant', badgeIcon: '🌱', color: '#90EE90', nextLevelBonus: '1.1' },
  { level: 2, xpRequired: 50, xpRangeStart: 50, xpRangeEnd: 149, tier: 'beginner' as const, title: 'Apprenti', badgeIcon: '🌱', color: '#90EE90', nextLevelBonus: '1.1' },
  { level: 3, xpRequired: 150, xpRangeStart: 150, xpRangeEnd: 299, tier: 'beginner' as const, title: 'Étudiant', badgeIcon: '🌱', color: '#90EE90', nextLevelBonus: '1.1' },
  { level: 4, xpRequired: 300, xpRangeStart: 300, xpRangeEnd: 549, tier: 'beginner' as const, title: 'Apprenant', badgeIcon: '🌱', color: '#90EE90', nextLevelBonus: '1.1' },
  { level: 5, xpRequired: 550, xpRangeStart: 550, xpRangeEnd: 949, tier: 'beginner' as const, title: 'Avancé', badgeIcon: '🌱', color: '#90EE90', nextLevelBonus: '1.1' },
  { level: 6, xpRequired: 950, xpRangeStart: 950, xpRangeEnd: 1499, tier: 'intermediate' as const, title: 'Confirmé', badgeIcon: '🌿', color: '#87CEEB', nextLevelBonus: '1.15' },
  { level: 7, xpRequired: 1500, xpRangeStart: 1500, xpRangeEnd: 2249, tier: 'intermediate' as const, title: 'Compétent', badgeIcon: '🌿', color: '#87CEEB', nextLevelBonus: '1.15' },
  { level: 8, xpRequired: 2250, xpRangeStart: 2250, xpRangeEnd: 3249, tier: 'intermediate' as const, title: 'Habile', badgeIcon: '🌿', color: '#87CEEB', nextLevelBonus: '1.15' },
  { level: 9, xpRequired: 3250, xpRangeStart: 3250, xpRangeEnd: 4499, tier: 'intermediate' as const, title: 'Qualifié', badgeIcon: '🌿', color: '#87CEEB', nextLevelBonus: '1.15' },
  { level: 10, xpRequired: 4500, xpRangeStart: 4500, xpRangeEnd: 5999, tier: 'intermediate' as const, title: 'Expérimenté', badgeIcon: '🌿', color: '#87CEEB', nextLevelBonus: '1.15' },
  { level: 11, xpRequired: 6000, xpRangeStart: 6000, xpRangeEnd: 7999, tier: 'advanced' as const, title: 'Expert', badgeIcon: '🌳', color: '#DDA0DD', nextLevelBonus: '1.2' },
  { level: 12, xpRequired: 8000, xpRangeStart: 8000, xpRangeEnd: 10499, tier: 'advanced' as const, title: 'Spécialiste', badgeIcon: '🌳', color: '#DDA0DD', nextLevelBonus: '1.2' },
  { level: 13, xpRequired: 10500, xpRangeStart: 10500, xpRangeEnd: 13499, tier: 'advanced' as const, title: 'Professionnel', badgeIcon: '🌳', color: '#DDA0DD', nextLevelBonus: '1.2' },
  { level: 14, xpRequired: 13500, xpRangeStart: 13500, xpRangeEnd: 16999, tier: 'advanced' as const, title: 'Maître', badgeIcon: '🌳', color: '#DDA0DD', nextLevelBonus: '1.2' },
  { level: 15, xpRequired: 17000, xpRangeStart: 17000, xpRangeEnd: 20999, tier: 'advanced' as const, title: 'Autorité', badgeIcon: '🌳', color: '#DDA0DD', nextLevelBonus: '1.2' },
  { level: 16, xpRequired: 21000, xpRangeStart: 21000, xpRangeEnd: 25999, tier: 'expert' as const, title: 'Gourou', badgeIcon: '🌴', color: '#FFB347', nextLevelBonus: '1.25', isMilestone: true },
  { level: 17, xpRequired: 26000, xpRangeStart: 26000, xpRangeEnd: 31999, tier: 'expert' as const, title: 'Visionnaire', badgeIcon: '🌴', color: '#FFB347', nextLevelBonus: '1.25' },
  { level: 18, xpRequired: 32000, xpRangeStart: 32000, xpRangeEnd: 38999, tier: 'expert' as const, title: 'Innovateur', badgeIcon: '🌴', color: '#FFB347', nextLevelBonus: '1.25' },
  { level: 19, xpRequired: 39000, xpRangeStart: 39000, xpRangeEnd: 46999, tier: 'expert' as const, title: 'Pionnier', badgeIcon: '🌴', color: '#FFB347', nextLevelBonus: '1.25' },
  { level: 20, xpRequired: 47000, xpRangeStart: 47000, xpRangeEnd: 55999, tier: 'expert' as const, title: 'Leader', badgeIcon: '🌴', color: '#FFB347', nextLevelBonus: '1.25' },
  { level: 21, xpRequired: 56000, xpRangeStart: 56000, xpRangeEnd: 66999, tier: 'master' as const, title: 'Maître Jedi', badgeIcon: '🌟', color: '#FFD700', nextLevelBonus: '1.3', isMilestone: true },
  { level: 22, xpRequired: 67000, xpRangeStart: 67000, xpRangeEnd: 79999, tier: 'master' as const, title: 'Sensei', badgeIcon: '🌟', color: '#FFD700', nextLevelBonus: '1.3' },
  { level: 23, xpRequired: 80000, xpRangeStart: 80000, xpRangeEnd: 94999, tier: 'master' as const, title: 'Sage', badgeIcon: '🌟', color: '#FFD700', nextLevelBonus: '1.3' },
  { level: 24, xpRequired: 95000, xpRangeStart: 95000, xpRangeEnd: 111999, tier: 'master' as const, title: 'Oracle', badgeIcon: '🌟', color: '#FFD700', nextLevelBonus: '1.3' },
  { level: 25, xpRequired: 112000, xpRangeStart: 112000, xpRangeEnd: 129999, tier: 'master' as const, title: 'Légende', badgeIcon: '🌟', color: '#FFD700', nextLevelBonus: '1.3', maxLevel: true },
];

async function seedAchievements(): Promise<{
  achievements: number;
  levels: number;
}> {
  const db = getDb();

  console.log('🏆 Starting achievements seed...');

  try {
    // Seed achievements
    console.log('🎖️ Seeding achievements...');
    const insertedAchievements = await db.insert(achievementTable)
      .values(achievementData.map(achievement => ({
        ...achievement,
        isActive: true,
        isHidden: false,
        isRepeatable: achievement.isRepeatable || false,
        maxCompletions: achievement.maxCompletions || null,
        seasonal: false,
        prerequisiteIds: [],
        minimumLevel: 1,
        sortOrder: 0,
      })))
      .returning();

    console.log(`✅ Inserted ${insertedAchievements.length} achievements`);

    // Seed levels
    console.log('⬆️ Seeding levels...');
    const insertedLevels = await db.insert(levels)
      .values(levelData)
      .returning();

    console.log(`✅ Inserted ${insertedLevels.length} levels`);

    console.log('🎉 Achievements seed completed successfully!');

    return {
      achievements: insertedAchievements.length,
      levels: insertedLevels.length,
    };
  }
  catch (error) {
    console.error('❌ Achievements seed failed:', error);
    throw error;
  }
}

// Export for use in other files
// Type exports
export type AchievementSeedResult = ReturnType<typeof seedAchievements> extends Promise<infer T> ? T : never;

export { seedAchievements };
