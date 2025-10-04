// packages/data-ops/database/setup.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Type exports
export type Database = ReturnType<typeof drizzle>;

let db: Database;

export function initDatabase(connection: {
  host: string;
  username: string;
  password: string;
}): Database {
  if (db) {
    return db;
  }
  const connectionString = `postgresql://${connection.username}:${connection.password}@${connection.host}?sslmode=require`;
  const sql = neon(connectionString);
  db = drizzle(sql);
  return db;
}

export function getDb(): Database {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}
