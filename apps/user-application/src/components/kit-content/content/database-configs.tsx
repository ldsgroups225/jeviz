export const databaseConfigs = {
  postgresql: {
    label: "PostgreSQL",
    code: `# PostgreSQL Configuration (Supabase, Neon, etc.)
DATABASE_HOST="hostname.com/database-name"
DATABASE_USERNAME="username"
DATABASE_PASSWORD="password"`,
  },
  mysql: {
    label: "MySQL",
    code: `# MySQL Configuration (PlanetScale, etc.)
DATABASE_HOST="hostname.com/database-name"
DATABASE_USERNAME="username"
DATABASE_PASSWORD="password"`,
  },
  cloudflare_d1: {
    label: "Cloudflare D1",
    code: `# Cloudflare D1 Configuration
CLOUDFLARE_DATABASE_ID="<From Cloudflare Dashboard>"
CLOUDFLARE_ACCOUNT_ID="<From Cloudflare Dashboard>"
CLOUDFLARE_D1_TOKEN="<Create in Cloudflare Dashboard>"`,
  },
};

export const drizzleKitConfigs = {
  postgresql: {
    label: "PostgreSQL",
    code: `import type { Config } from "drizzle-kit";
const config: Config = {
  out: "./src/drizzle",
  schema: ["./src/drizzle/auth-schema.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: \`postgresql://\${process.env.DATABASE_USERNAME}:\${process.env.DATABASE_PASSWORD}@\${process.env.DATABASE_HOST}\`,
  },
  tablesFilter: ["!_cf_KV", "!auth_*"],
};

export default config satisfies Config;
  `,
  },
  mysql: {
    label: "MySQL",
    code: `import type { Config } from "drizzle-kit";
const config: Config = {
  out: "./src/drizzle",
  schema: ["./src/drizzle/auth-schema.ts"],
  dialect: "mysql",
  dbCredentials: {
    url: \`mysql://\${process.env.DATABASE_USERNAME}:\${process.env.DATABASE_PASSWORD}@\${process.env.DATABASE_HOST}\`,
  },
  tablesFilter: ["!_cf_KV", "!auth_*"],
};

export default config satisfies Config;
`,
  },
  cloudflare_d1: {
    label: "Cloudflare D1",
    code: `import type { Config } from "drizzle-kit";
const config: Config = {
  out: "./src/drizzle",
  schema: ["./src/drizzle/auth-schema.ts"],
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
  tablesFilter: ["!_cf_KV", "!auth_*"],
};

export default config satisfies Config;
`,
  },
};
export const drizzleDbConfigs = {
  cloudflare_d1: {
    label: "Cloudflare D1",
    code: `import { drizzle } from "drizzle-orm/d1";

let db: ReturnType<typeof drizzle>;

export function initDatabase(d1Db: D1Database) {
  if (db) {
    return db
  }
  db = drizzle(d1Db);
  return db;
}

export function getDb() {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
}`,
  },
  mysql: {
    label: "MySQL",
    code: `import { drizzle } from "drizzle-orm/planetscale-serverless";

let db: ReturnType<typeof drizzle>;

export function initDatabase(connection: {
  host: string;
  username: string;
  password: string;
}) {
  if (db) {
    return db
  }
  db = drizzle({ connection });
  return db;
}

export function getDb() {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
}`,
  },
  postgresql: {
    label: "PostgreSQL",
    code: `import { drizzle } from "drizzle-orm/neon-http";

let db: ReturnType<typeof drizzle>;

export function initDatabase(connection: {
  host: string;
  username: string;
  password: string;
}) {
  if (db) {
    return db;
  }
  const connectionString = \`postgres://\${connection.username}:\${connection.password}@\${connection.host}\`;
  db = drizzle(connectionString);
  return db;
}

export function getDb() {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
}
  `,
  },
};
