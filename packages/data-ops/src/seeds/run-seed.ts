import type { AchievementSeedResult } from './achievements-seed';
// Type imports for return values
import type { CurriculumSeedResult } from './curriculum-seed';
import type { Database } from '@/database/setup';
// Seed runner for Jeviz database
import { initDatabase } from '@/database/setup';

import { seedAchievements } from './achievements-seed';
import { seedCurriculum } from './curriculum-seed';

type SeedSummary = {} & CurriculumSeedResult & AchievementSeedResult;

async function main(): Promise<void> {
  console.log('🚀 Starting Jeviz database seeding...');

  try {
    // Initialize database connection
    console.log('📡 Connecting to database...');
    const _db: Database = initDatabase({
      host: process.env.DATABASE_HOST!,
      username: process.env.DATABASE_USERNAME!,
      password: process.env.DATABASE_PASSWORD!,
    });

    console.log('✅ Database connected successfully');

    // Run curriculum seed
    console.log('📚 Seeding curriculum...');
    const curriculumResult = await seedCurriculum();

    // Run achievements seed
    console.log('🏆 Seeding achievements...');
    const achievementsResult = await seedAchievements();

    const totalResult: SeedSummary = {
      ...curriculumResult,
      ...achievementsResult,
    };

    console.log('🎉 All seeds completed successfully!');
    console.log('📊 Summary:', totalResult);

    process.exit(0);
  }
  catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

main();
