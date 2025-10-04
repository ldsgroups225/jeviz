// packages/data-ops/drizzle.config.ts
import type { Config } from 'drizzle-kit';

const config: Config = {
  out: './src/drizzle',
  schema: [
    './src/drizzle/auth-schema.ts',
    './src/drizzle/combined-schema.ts',
  ],
  dialect: 'postgresql',
  dbCredentials: {
    url: `postgresql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}?sslmode=require`,
  },
  tablesFilter: ['!auth_*'],
  strict: true,
};

export default config satisfies Config;
