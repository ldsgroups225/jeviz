import type {
  FlashcardCreate as FlashcardCreateType,
} from '@/zod-schema/flashcards';
// Type imports from zod-schema
import type {
  ChapterCreate,
  SubjectCreate,
} from '@/zod-schema/subjects';
import { eq } from 'drizzle-orm';

// Ivory Coast Curriculum Seed Data for Jeviz
import { getDb } from '@/database/setup';
import {
  chapters,
  flashcards,
  subjects,
} from '@/drizzle/schema';

// 3ème BEPC Subjects (all students take these 12 subjects)
const troisiemeSubjects: SubjectCreate[] = [
  {
    name: 'Français',
    shortName: 'FR',
    grade: '3ème' as const,
    coefficient: 4,
    examDuration: 180,
    examFormat: 'écrit' as const,
    isCore: true,
    languageChoice: false,
    description: 'Langue française, littérature, expression écrite et orale',
    color: '#0066CC',
    icon: '📖',
  },
  {
    name: 'Mathématiques',
    shortName: 'MATH',
    grade: '3ème' as const,
    coefficient: 4,
    examDuration: 180,
    examFormat: 'écrit' as const,
    isCore: true,
    languageChoice: false,
    description: 'Calcul, algèbre, géométrie, statistiques',
    color: '#FF6B6B',
    icon: '🔢',
  },
  {
    name: 'Histoire et Géographie',
    shortName: 'H-G',
    grade: '3ème' as const,
    coefficient: 3,
    examDuration: 150,
    examFormat: 'écrit' as const,
    isCore: true,
    languageChoice: false,
    description: 'Histoire de la Côte d\'Ivoire et du monde, géographie physique et humaine',
    color: '#4ECDC4',
    icon: '🌍',
  },
  {
    name: 'Sciences de la Vie et de la Terre',
    shortName: 'SVT',
    grade: '3ème' as const,
    coefficient: 3,
    examDuration: 150,
    examFormat: 'écrit' as const,
    isCore: true,
    languageChoice: false,
    description: 'Biologie, géologie, écologie, santé',
    color: '#95E77E',
    icon: '🔬',
  },
  {
    name: 'Physique-Chimie',
    shortName: 'PC',
    grade: '3ème' as const,
    coefficient: 3,
    examDuration: 150,
    examFormat: 'écrit' as const,
    isCore: true,
    languageChoice: false,
    description: 'Matière, énergie, forces, réactions chimiques',
    color: '#FFB347',
    icon: '⚗️',
  },
  {
    name: 'Anglais',
    shortName: 'ENG',
    grade: '3ème' as const,
    coefficient: 2,
    examDuration: 120,
    examFormat: 'écrit' as const,
    isCore: true,
    languageChoice: false,
    description: 'English language, grammar, vocabulary, comprehension',
    color: '#B4A7D6',
    icon: '🇬🇧',
  },
  {
    name: 'Éducation Civique et Morale',
    shortName: 'ECM',
    grade: '3ème' as const,
    coefficient: 2,
    examDuration: 120,
    examFormat: 'écrit' as const,
    isCore: true,
    languageChoice: false,
    description: 'Citoyenneté, droits et devoirs, institutions ivoiriennes',
    color: '#F4A460',
    icon: '⚖️',
  },
  {
    name: 'Technologie',
    shortName: 'TECH',
    grade: '3ème' as const,
    coefficient: 2,
    examDuration: 120,
    examFormat: 'écrit' as const,
    isCore: true,
    languageChoice: false,
    description: 'Informatique, technologies modernes, innovation',
    color: '#87CEEB',
    icon: '💻',
  },
  {
    name: 'Arts Plastiques',
    shortName: 'ART',
    grade: '3ème' as const,
    coefficient: 1,
    examDuration: 90,
    examFormat: 'pratique' as const,
    isCore: false,
    languageChoice: false,
    description: 'Dessin, peinture, histoire de l\'art',
    color: '#DDA0DD',
    icon: '🎨',
  },
  {
    name: 'Éducation Physique et Sportive',
    shortName: 'EPS',
    grade: '3ème' as const,
    coefficient: 1,
    examDuration: 60,
    examFormat: 'pratique' as const,
    isCore: false,
    languageChoice: false,
    description: 'Sports, santé, développement physique',
    color: '#98FB98',
    icon: '⚽',
  },
  {
    name: 'Éducation Musicale',
    shortName: 'MUS',
    grade: '3ème' as const,
    coefficient: 1,
    examDuration: 60,
    examFormat: 'pratique' as const,
    isCore: false,
    languageChoice: false,
    description: 'Théorie musicale, chant, instruments',
    color: '#FFDAB9',
    icon: '🎵',
  },
  {
    name: 'Éducation Familiale et Sociale',
    shortName: 'EFS',
    grade: '3ème' as const,
    coefficient: 1,
    examDuration: 60,
    examFormat: 'oral' as const,
    isCore: false,
    languageChoice: false,
    description: 'Vie familiale, développement de l\'enfant, société',
    color: '#F0E68C',
    icon: '👨‍👩‍👧‍👦',
  },
];

// Terminale BAC Subjects - Series A, C, D, E, G
const terminaleSubjects: SubjectCreate[] = [
  {
    name: 'Français',
    shortName: 'FR',
    grade: 'Terminale' as const,
    series: ['A', 'C', 'D', 'E', 'G'],
    coefficient: 5,
    examDuration: 240,
    examFormat: 'écrit' as const,
    isCore: true,
    languageChoice: false,
    description: 'Littérature, philosophie, expression écrite et orale',
    color: '#0066CC',
    icon: '📖',
  },
  {
    name: 'Philosophie',
    shortName: 'PHILO',
    grade: 'Terminale' as const,
    series: ['A', 'C', 'D', 'E', 'G'],
    coefficient: 4,
    examDuration: 240,
    examFormat: 'écrit' as const,
    isCore: true,
    languageChoice: false,
    description: 'Pensée critique, éthique, métaphysique, logique',
    color: '#9370DB',
    icon: '🤔',
  },
  {
    name: 'Mathématiques',
    shortName: 'MATH',
    grade: 'Terminale' as const,
    series: ['C', 'D'],
    coefficient: 6,
    examDuration: 240,
    examFormat: 'écrit' as const,
    isCore: true,
    languageChoice: false,
    description: 'Algèbre avancée, géométrie, calcul différentiel, probabilités',
    color: '#FF6B6B',
    icon: '🔢',
  },
  {
    name: 'Physique-Chimie',
    shortName: 'PC',
    grade: 'Terminale' as const,
    series: ['C', 'D'],
    coefficient: 5,
    examDuration: 240,
    examFormat: 'écrit' as const,
    isCore: true,
    languageChoice: false,
    description: 'Mécanique, thermodynamique, optique, chimie organique',
    color: '#FFB347',
    icon: '⚗️',
  },
  {
    name: 'Sciences de la Vie et de la Terre',
    shortName: 'SVT',
    grade: 'Terminale' as const,
    series: ['D'],
    coefficient: 5,
    examDuration: 240,
    examFormat: 'écrit' as const,
    isCore: true,
    languageChoice: false,
    description: 'Génétique, évolution, physiologie, écologie',
    color: '#95E77E',
    icon: '🔬',
  },
  {
    name: 'Allemand',
    shortName: 'ALL',
    grade: 'Terminale' as const,
    series: ['A', 'C', 'D'],
    coefficient: 3,
    examDuration: 180,
    examFormat: 'écrit' as const,
    isCore: false,
    languageChoice: true,
    mutualExclusiveWith: undefined, // Will be set after insertion
    description: 'Deutsche Sprache, Grammatik, Literatur',
    color: '#FFD700',
    icon: '🇩🇪',
  },
  {
    name: 'Espagnol',
    shortName: 'ESP',
    grade: 'Terminale' as const,
    series: ['A', 'C', 'D'],
    coefficient: 3,
    examDuration: 180,
    examFormat: 'écrit' as const,
    isCore: false,
    languageChoice: true,
    mutualExclusiveWith: undefined, // Will be set after insertion
    description: 'Lengua española, gramática, literatura',
    color: '#FF7F50',
    icon: '🇪🇸',
  },
  {
    name: 'Histoire et Géographie',
    shortName: 'H-G',
    grade: 'Terminale' as const,
    series: ['A'],
    coefficient: 4,
    examDuration: 240,
    examFormat: 'écrit' as const,
    isCore: true,
    languageChoice: false,
    description: 'Histoire contemporaine, géographie économique et politique',
    color: '#4ECDC4',
    icon: '🌍',
  },
  {
    name: 'Économie',
    shortName: 'ECO',
    grade: 'Terminale' as const,
    series: ['E', 'G'],
    coefficient: 4,
    examDuration: 240,
    examFormat: 'écrit' as const,
    isCore: true,
    languageChoice: false,
    description: 'Microéconomie, macroéconomie, économie ivoirienne',
    color: '#32CD32',
    icon: '💰',
  },
  {
    name: 'Comptabilité',
    shortName: 'COMPTA',
    grade: 'Terminale' as const,
    series: ['G'],
    coefficient: 5,
    examDuration: 240,
    examFormat: 'écrit' as const,
    isCore: true,
    languageChoice: false,
    description: 'Comptabilité générale, analytique, gestion financière',
    color: '#8B4513',
    icon: '📊',
  },
  {
    name: 'Droit',
    shortName: 'DROIT',
    grade: 'Terminale' as const,
    series: ['G'],
    coefficient: 3,
    examDuration: 180,
    examFormat: 'écrit' as const,
    isCore: false,
    languageChoice: false,
    description: 'Droit civil, commercial, droit des affaires',
    color: '#696969',
    icon: '⚖️',
  },
  {
    name: 'Anglais',
    shortName: 'ENG',
    grade: 'Terminale' as const,
    series: ['A', 'C', 'D', 'E', 'G'],
    coefficient: 2,
    examDuration: 180,
    examFormat: 'écrit' as const,
    isCore: true,
    languageChoice: false,
    description: 'English language, literature, business communication',
    color: '#B4A7D6',
    icon: '🇬🇧',
  },
];

// Chapter data generation functions
function getChaptersForMath3eme(): Omit<ChapterCreate, 'subjectId'>[] {
  return [
    {
      title: 'Opérations sur les nombres relatifs',
      description: 'Addition, soustraction, multiplication et division des nombres relatifs',
      order: 1,
      estimatedHours: 8,
      difficulty: 'facile' as const,
      objectives: ['Maîtriser les opérations de base', 'Comprendre les règles des signes'],
      prerequisites: ['Connaissance des nombres entiers'],
      isActive: true,
    },
    {
      title: 'Équations du premier degré',
      description: 'Résolution d\'équations à une inconnue et mise en équation de problèmes',
      order: 2,
      estimatedHours: 10,
      difficulty: 'moyen' as const,
      objectives: ['Résoudre des équations linéaires', 'Traduire des problèmes en équations'],
      prerequisites: ['Opérations sur les relatifs'],
      isActive: true,
    },
    {
      title: 'Inéquations du premier degré',
      description: 'Résolution d\'inéquations et représentation graphique des solutions',
      order: 3,
      estimatedHours: 8,
      difficulty: 'moyen' as const,
      objectives: ['Résoudre des inéquations', 'Représenter des solutions'],
      prerequisites: ['Équations du premier degré'],
      isActive: true,
    },
    {
      title: 'Systèmes de deux équations',
      description: 'Résolution de systèmes par substitution et par combinaison',
      order: 4,
      estimatedHours: 12,
      difficulty: 'moyen' as const,
      objectives: ['Résoudre des systèmes 2x2', 'Appliquer à des problèmes concrets'],
      prerequisites: ['Équations du premier degré'],
      isActive: true,
    },
    {
      title: 'Puissances et racines carrées',
      description: 'Propriétés des puissances, calculs avec les racines carrées',
      order: 5,
      estimatedHours: 8,
      difficulty: 'moyen' as const,
      objectives: ['Calculer avec les puissances', 'Simplifier les racines'],
      prerequisites: ['Opérations de base'],
      isActive: true,
    },
    {
      title: 'Calcul littéral',
      description: 'Développement, factorisation et identités remarquables',
      order: 6,
      estimatedHours: 12,
      difficulty: 'difficile' as const,
      objectives: ['Développer et factoriser', 'Utiliser les identités remarquables'],
      prerequisites: ['Puissances et opérations'],
      isActive: true,
    },
  ];
}

function getChaptersForFrancais3eme(): Omit<ChapterCreate, 'subjectId'>[] {
  return [
    {
      title: 'Les types de textes',
      description: 'Identifier et analyser les différents types de textes (narratif, descriptif, argumentatif)',
      order: 1,
      estimatedHours: 6,
      difficulty: 'facile' as const,
      objectives: ['Reconnaître les types de textes', 'Analyser la structure des textes'],
      prerequisites: ['Lecture compréhension de base'],
      isActive: true,
    },
    {
      title: 'La phrase complexe',
      description: 'Construction et analyse des phrases complexes avec propositions subordonnées',
      order: 2,
      estimatedHours: 10,
      difficulty: 'moyen' as const,
      objectives: ['Construire des phrases complexes', 'Identifier les propositions'],
      prerequisites: ['La phrase simple'],
      isActive: true,
    },
    {
      title: 'Les figures de style',
      description: 'Identification et utilisation des figures de style en littérature',
      order: 3,
      estimatedHours: 8,
      difficulty: 'moyen' as const,
      objectives: ['Reconnaître les figures de style', 'En analyser l\'effet'],
      prerequisites: ['Vocabulaire littéraire de base'],
      isActive: true,
    },
    {
      title: 'La poésie',
      description: 'Analyse de poèmes et versification française',
      order: 4,
      estimatedHours: 8,
      difficulty: 'moyen' as const,
      objectives: ['Analyser un poème', 'Comprendre la versification'],
      prerequisites: ['Figures de style'],
      isActive: true,
    },
    {
      title: 'Le théâtre',
      description: 'Étude de pièces théâtrales et analyse dialoguée',
      order: 5,
      estimatedHours: 10,
      difficulty: 'difficile' as const,
      objectives: ['Analyser une pièce de théâtre', 'Comprendre les dialogues'],
      prerequisites: ['Analyse textuelle'],
      isActive: true,
    },
    {
      title: 'L\'argumentation',
      description: 'Construction d\'arguments et analyse de textes argumentatifs',
      order: 6,
      estimatedHours: 12,
      difficulty: 'difficile' as const,
      objectives: ['Construire un argumentaire', 'Identifier les arguments'],
      prerequisites: ['Types de textes', 'Logique de base'],
      isActive: true,
    },
  ];
}

function getFlashcardsForChapter(chapterTitle: string, subjectShortName: string): Omit<FlashcardCreateType, 'chapterId'>[] {
  if (subjectShortName === 'MATH' && chapterTitle.includes('Opérations')) {
    return [
      {
        front: 'Que donne (-5) + (+3) ?',
        back: '-2',
        example: 'On soustrait 3 de 5 et on garde le signe du plus grand : -5 + 3 = -2',
        difficulty: 0.3,
        tags: ['addition', 'nombres relatifs'],
        isActive: true,
      },
      {
        front: 'Quelle est la règle pour multiplier deux nombres de signes différents ?',
        back: 'Le produit est négatif',
        example: '(-2) × (+3) = -6',
        difficulty: 0.4,
        tags: ['multiplication', 'signes'],
        isActive: true,
      },
      {
        front: 'Que donne (-7) - (-2) ?',
        back: '-5',
        example: 'Soustraire un négatif revient à additionner : (-7) - (-2) = (-7) + 2 = -5',
        difficulty: 0.5,
        tags: ['soustraction', 'nombres relatifs'],
        isActive: true,
      },
      {
        front: 'Comment divise-t-on deux nombres négatifs ?',
        back: 'Le quotient est positif',
        example: '(-12) ÷ (-3) = +4',
        difficulty: 0.4,
        tags: ['division', 'signes'],
        isActive: true,
      },
      {
        front: 'Règle des signes pour l\'addition',
        back: 'Si les signes sont identiques, on additionne et on garde le signe. S\'ils sont différents, on soustrait et on garde le signe du plus grand.',
        example: '(-3) + (-5) = -8 (mêmes signes), (-7) + (+2) = -5 (signes différents)',
        difficulty: 0.6,
        tags: ['règle', 'addition', 'mnémotechnique'],
        isActive: true,
      },
    ];
  }

  if (subjectShortName === 'FR' && chapterTitle.includes('phrase complexe')) {
    return [
      {
        front: 'Qu\'est-ce qu\'une proposition subordonnée relative ?',
        back: 'Une proposition qui introduit un complément du nom et commence par \'qui\', \'que\', \'où\', \'dont\', \'lequel\'',
        example: 'L\'homme qui parle est mon professeur.',
        difficulty: 0.4,
        tags: ['subordonnée', 'relative', 'grammaire'],
        isActive: true,
      },
      {
        front: 'Comment reconnaît-on une proposition subordonnée conjonctive ?',
        back: 'Elle commence par une conjonction de subordination (que, quand, si, parce que, etc.)',
        example: 'Je sais qu\'il viendra demain.',
        difficulty: 0.5,
        tags: ['subordonnée', 'conjonctive', 'grammaire'],
        isActive: true,
      },
      {
        front: 'Qu\'est-ce qu\'une proposition subordonnée infinitive ?',
        back: 'Une proposition avec un verbe à l\'infinitif introduite par \'de\', \'à\', \'pour\'',
        example: 'Je veux partir.',
        difficulty: 0.3,
        tags: ['subordonnée', 'infinitive', 'grammaire'],
        isActive: true,
      },
      {
        front: 'Comment s\'appelle la proposition principale dans une phrase complexe ?',
        back: 'C\'est celle qui peut se suffire à elle-même et qui ne dépend d\'aucune autre proposition',
        example: 'Dans \'Je mange quand j\'ai faim\', \'Je mange\' est la principale.',
        difficulty: 0.3,
        tags: ['proposition', 'principale', 'grammaire'],
        isActive: true,
      },
    ];
  }

  // Default flashcards for other chapters
  return [
    {
      front: `Quelle est l'importance de ${chapterTitle} ?`,
      back: `C'est un concept fondamental qui aide à comprendre les notions plus avancées.`,
      difficulty: 0.5,
      tags: ['concept', 'fondamental'],
      isActive: true,
    },
  ];
}

async function seedCurriculum(): Promise<{
  subjects: number;
  chapters: number;
  flashcards: string;
}> {
  const db = getDb();

  console.log('🌱 Starting Ivory Coast curriculum seed...');

  try {
    // 1. Seed subjects
    console.log('📚 Seeding subjects...');
    const allSubjects = [...troisiemeSubjects, ...terminaleSubjects];
    const insertedSubjects = await db.insert(subjects)
      .values(allSubjects)
      .returning();

    console.log(`✅ Inserted ${insertedSubjects.length} subjects`);

    // 2. Handle mutual exclusivity for language subjects
    const allemandSubject = insertedSubjects.find(s => s.shortName === 'ALL');
    const espagnolSubject = insertedSubjects.find(s => s.shortName === 'ESP');

    if (allemandSubject && espagnolSubject) {
      await db.update(subjects)
        .set({ mutualExclusiveWith: espagnolSubject.id })
        .where(eq(subjects.id, allemandSubject.id));

      await db.update(subjects)
        .set({ mutualExclusiveWith: allemandSubject.id })
        .where(eq(subjects.id, espagnolSubject.id));
    }

    // 3. Seed chapters for each subject
    console.log('📖 Seeding chapters...');
    let totalChapters = 0;

    for (const subject of insertedSubjects) {
      let chapterData: Omit<ChapterCreate, 'subjectId'>[] = [];

      if (subject.grade === '3ème' && subject.shortName === 'MATH') {
        chapterData = getChaptersForMath3eme();
      }
      else if (subject.grade === '3ème' && subject.shortName === 'FR') {
        chapterData = getChaptersForFrancais3eme();
      }
      else {
        // Generic chapters for other subjects
        const chapterCount = subject.isCore ? 6 : 4;
        chapterData = Array.from({ length: chapterCount }, (_, i) => ({
          title: `Chapitre ${i + 1}`,
          description: `Chapitre ${i + 1} de ${subject.name}`,
          order: i + 1,
          estimatedHours: subject.isCore ? 8 : 6,
          difficulty: i < 2 ? 'facile' as const : i < 4 ? 'moyen' as const : 'difficile' as const,
          objectives: [`Objectif ${i + 1} du chapitre`],
          prerequisites: i > 0 ? [`Chapitre ${i}`] : [],
          isActive: true,
        }));
      }

      const insertedChapters = await db.insert(chapters)
        .values(chapterData.map(ch => ({ ...ch, subjectId: subject.id, estimatedHours: String(ch.estimatedHours) })))
        .returning();

      totalChapters += insertedChapters.length;
      console.log(`  📄 ${insertedChapters.length} chapters for ${subject.name}`);

      // 4. Seed flashcards for each chapter
      for (const chapter of insertedChapters) {
        const flashcardData = getFlashcardsForChapter(chapter.title, subject.shortName);

        if (flashcardData.length > 0) {
          await db.insert(flashcards)
            .values(flashcardData.map(fc => ({ ...fc, chapterId: chapter.id, difficulty: String(fc.difficulty) })));
          console.log(`    💳 ${flashcardData.length} flashcards for ${chapter.title}`);
        }
      }
    }

    console.log(`✅ Total: ${totalChapters} chapters seeded`);
    console.log('🎉 Curriculum seed completed successfully!');

    return {
      subjects: insertedSubjects.length,
      chapters: totalChapters,
      flashcards: 'Sample flashcards created',
    };
  }
  catch (error) {
    console.error('❌ Curriculum seed failed:', error);
    throw error;
  }
}

// Run seed function if this file is executed directly
if (require.main === module) {
  seedCurriculum()
    .then((result) => {
      console.log('🎉 All seeds completed successfully!');
      console.log('Result:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seed failed:', error);
      process.exit(1);
    });
}

// Type exports
export type CurriculumSeedResult = ReturnType<typeof seedCurriculum> extends Promise<infer T> ? T : never;

export { seedCurriculum };
