export const authEnvConfigs = {
  postgresql: {
    label: "PostgreSQL",
    code: `# Auth Environment Variables
BETTER_AUTH_SECRET="your-secret-key-here"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"`,
  },
  mysql: {
    label: "MySQL",
    code: `# Auth Environment Variables
BETTER_AUTH_SECRET="your-secret-key-here"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"`,
  },
  cloudflare_d1: {
    label: "Cloudflare D1",
    code: `# Auth Environment Variables
BETTER_AUTH_SECRET="your-secret-key-here"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
`,
  },
};

export const betterAuthCliConfigs = {
  postgresql: {
    label: "PostgreSQL",
    code: `import { createBetterAuth } from "../src/auth/setup";
import { initDatabase } from "../src/database/setup";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = createBetterAuth({
  database: drizzleAdapter(
    initDatabase({
      password: process.env.DATABASE_PASSWORD!,
      host: process.env.DATABASE_HOST!,
      username: process.env.DATABASE_USERNAME!,
    }),
    {
      provider: "pg",
    },
  ),
});`,
  },
  mysql: {
    label: "MySQL",
    code: `import { createBetterAuth } from "../src/auth/setup";
import { initDatabase } from "../src/database/setup";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = createBetterAuth({
  database: drizzleAdapter(
    initDatabase({
      password: process.env.DATABASE_PASSWORD!,
      host: process.env.DATABASE_HOST!,
      username: process.env.DATABASE_USERNAME!,
    }),
    {
      provider: "mysql",
    },
  ),
});`,
  },
  cloudflare_d1: {
    label: "Cloudflare D1",
    code: `import { createBetterAuth } from "../src/auth/setup";
import Database from "better-sqlite3";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

// For CLI use - uses dummy SQLite database
export const auth = createBetterAuth({
  database: drizzleAdapter(new Database("./config/test.sqlite"), {
    provider: "sqlite",
  }),
});`,
  },
};

export const runtimeAuthConfigs = {
  postgresql: {
    label: "PostgreSQL Runtime Setup",
    code: `// In your server.ts file
import { initDatabase } from "@repo/data-ops/database/setup";
import { setAuth } from "@repo/data-ops/auth/server";

export default {
  fetch: async (request: Request, env: Env) => {
    const db = initDatabase({
      host: env.DATABASE_HOST,
      username: env.DATABASE_USERNAME,
      password: env.DATABASE_PASSWORD,
    });

    setAuth({
      secret: env.BETTER_AUTH_SECRET,
      socialProviders: {
        google: {
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
      },
      adapter: {
        drizzleDb: db,
        provider: "pg",
      },
    });

    return fetch(request);
  },
};`,
  },
  mysql: {
    label: "MySQL Runtime Setup",
    code: `// In your server.ts file
import { initDatabase } from "@repo/data-ops/database/setup";
import { setAuth } from "@repo/data-ops/auth/server";

export default {
  fetch: async (request: Request, env: Env) => {
    const db = initDatabase({
      host: env.DATABASE_HOST,
      username: env.DATABASE_USERNAME,
      password: env.DATABASE_PASSWORD,
    });

    setAuth({
      secret: env.BETTER_AUTH_SECRET,
      socialProviders: {
        google: {
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
      },
      adapter: {
        drizzleDb: db,
        provider: "mysql",
      },
    });

    return fetch(request);
  },
};`,
  },
  cloudflare_d1: {
    label: "Cloudflare D1 Runtime Setup",
    code: `// In your server.ts file (for Cloudflare Workers)
import { initDatabase } from "@repo/data-ops/database/setup";
import { setAuth } from "@repo/data-ops/auth/server";

export default {
  fetch: async (request: Request, env: Env) => {
    const db = initDatabase(env.DB); // D1 binding

    setAuth({
      secret: env.BETTER_AUTH_SECRET,
      socialProviders: {
        google: {
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
      },
      adapter: {
        drizzleDb: db,
        provider: "sqlite",
      },
    });

    return fetch(request);
  },
};`,
  },
};
