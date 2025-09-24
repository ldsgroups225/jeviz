import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  PageTitle,
  InfoSection,
  CodeBlock,
  StepCard,
  Callout,
} from "@/components/kit-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  authEnvConfigs,
  betterAuthCliConfigs,
  runtimeAuthConfigs,
} from "@/components/kit-content/content/auth-configs";

export const Route = createFileRoute("/_static/auth/")({
  component: AuthSetupPage,
});

function AuthSetupPage() {
  const [activeTab, setActiveTab] = useState("postgresql");

  return (
    <main className="pt-20 pb-16 mt-6">
      <div className="container mx-auto max-w-4xl px-4">
        <PageTitle
          badge="Setup Guide"
          title="Better Auth Setup"
          subtitle="Configure secure authentication with Better Auth"
        />

        <InfoSection title="Overview">
          <p>
            Better Auth provides a comprehensive authentication solution that
            works seamlessly with serverless and edge environments. It offers
            built-in support for multiple authentication strategies including
            social providers, email/password, and session management.
          </p>
          <p>
            The authentication system is designed with{" "}
            <strong>database-agnostic architecture</strong> and includes:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>
              <strong>Social Authentication</strong> - Support for Google,
              GitHub, Discord, and other OAuth providers
            </li>
            <li>
              <strong>Session Management</strong> - Secure token-based sessions
              with automatic refresh
            </li>
            <li>
              <strong>Database Integration</strong> - Works with PostgreSQL,
              MySQL, and SQLite and other providers through Drizzle ORM
            </li>
            <li>
              <strong>Type Safety</strong> - Full TypeScript support with
              auto-generated schemas
            </li>
            <li>
              <strong>Edge Compatible</strong> - Optimized for serverless and
              edge runtime environments
            </li>
          </ul>
        </InfoSection>

        <StepCard step={1} title="Configure environment variables">
          <p>
            Set up the required environment variables for authentication. You'll
            need a secret key for token signing and OAuth credentials for social
            authentication providers.
          </p>
          <p className="mt-3">
            Generate a secure secret key using:{" "}
            <code>openssl rand -base64 32</code>
          </p>

          <Tabs
            className="mt-4 mb-4"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="postgresql">PostgreSQL</TabsTrigger>
              <TabsTrigger value="mysql">MySQL</TabsTrigger>
              <TabsTrigger value="cloudflare_d1">Cloudflare D1</TabsTrigger>
            </TabsList>
            {Object.entries(authEnvConfigs).map(([key, config]) => (
              <TabsContent key={key} value={key}>
                <CodeBlock
                  code={config.code}
                  filename="packages/data-ops/.env"
                />
              </TabsContent>
            ))}
          </Tabs>

          <Callout type="info">
            <p>
              <strong>OAuth Setup:</strong> Create OAuth applications in your
              provider's developer console (e.g., Google Cloud Console) and add
              the redirect URI:{" "}
              <code>https://your-domain.com/api/auth/callback/google</code>
            </p>
          </Callout>
        </StepCard>

        <StepCard step={2} title="Configure Better Auth CLI">
          <p>
            Create the Better Auth configuration for the CLI. This configuration
            is used by the <code>better-auth:generate</code> command to create
            database schemas and TypeScript types.
          </p>
          <p className="mt-3">
            Update your <code>packages/data-ops/config/auth.ts</code> file based
            on your database provider. This instance is used exclusively by the
            Better Auth CLI and should not be used in your application runtime.
          </p>

          <Tabs className="mt-4" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="postgresql">PostgreSQL</TabsTrigger>
              <TabsTrigger value="mysql">MySQL</TabsTrigger>
              <TabsTrigger value="cloudflare_d1">Cloudflare D1</TabsTrigger>
            </TabsList>
            {Object.entries(betterAuthCliConfigs).map(([key, config]) => (
              <TabsContent key={key} value={key}>
                <CodeBlock
                  language="typescript"
                  code={config.code}
                  filename="packages/data-ops/config/auth.ts"
                />
              </TabsContent>
            ))}
          </Tabs>
        </StepCard>

        <StepCard step={3} title="Generate authentication schemas">
          <p>
            Use Better Auth CLI to generate the database schemas and TypeScript
            types. This will create the necessary authentication tables in your
            database and generate type-safe schema definitions.
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <h4 className="font-semibold  mb-2">
                1. Generate Better Auth schemas
              </h4>
              <CodeBlock
                language="bash"
                code="pnpm run better-auth:generate"
                filename="Terminal"
              />
              <p className="text-sm  mt-2">
                This creates{" "}
                <code>packages/data-ops/src/drizzle/auth-schema.ts</code> with
                your authentication tables
              </p>
            </div>

            <div>
              <h4 className="font-semibold  mb-2">
                2. Generate Drizzle migrations
              </h4>
              <CodeBlock
                language="bash"
                code="pnpm run drizzle:generate"
                filename="Terminal"
              />
              <p className="text-sm  mt-2">
                This creates SQL migration files in{" "}
                <code>packages/data-ops/src/drizzle</code>
              </p>
            </div>

            <div>
              <h4 className="font-semibold  mb-2">
                3. Run migrations (optional)
              </h4>
              <CodeBlock
                language="bash"
                code="pnpm run drizzle:migrate"
                filename="Terminal"
              />
              <p className="text-sm  mt-2">
                This automatically applies migrations to create the auth tables
              </p>
            </div>
          </div>

          <Callout type="warning">
            <p>
              <strong>Table Filtering:</strong> Auth tables are prefixed with{" "}
              <code>auth_</code> and filtered out in{" "}
              <code>drizzle.config.ts</code> to prevent conflicts when using{" "}
              <code>drizzle:pull</code> for application schemas.
            </p>
          </Callout>
        </StepCard>

        <StepCard step={4} title="Runtime authentication setup">
          <p>
            Configure authentication for your serverless application runtime.
            The <code>setAuth</code> function initializes Better Auth with your
            database connection and configuration during each serverless
            invocation.
          </p>
          <p className="mt-3">
            This setup occurs in your server entry point, typically{" "}
            <code>src/server.ts</code>, where you initialize the database and
            configure authentication before handling requests.
          </p>

          <Tabs className="mt-4" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="postgresql">PostgreSQL</TabsTrigger>
              <TabsTrigger value="mysql">MySQL</TabsTrigger>
              <TabsTrigger value="cloudflare_d1">Cloudflare D1</TabsTrigger>
            </TabsList>
            {Object.entries(runtimeAuthConfigs).map(([key, config]) => (
              <TabsContent key={key} value={key}>
                <CodeBlock
                  language="typescript"
                  code={config.code}
                  filename="apps/user-application/src/server.ts"
                />
              </TabsContent>
            ))}
          </Tabs>
        </StepCard>

        <StepCard step={5} title="API route integration">
          <p>
            Create API routes to handle authentication requests. Better Auth
            provides a single handler that manages all authentication endpoints
            including sign-in, sign-out, callbacks, and session management.
          </p>

          <CodeBlock
            language="typescript"
            code={`import { getAuth } from "@repo/data-ops/auth/server";
import { createServerFileRoute } from "@tanstack/react-start/server";

export const ServerRoute = createServerFileRoute("/api/auth/$").methods({
  GET: ({ request }) => {
    const auth = getAuth();
    return auth.handler(request);
  },
  POST: ({ request }) => {
    const auth = getAuth();
    return auth.handler(request);
  },
});`}
            filename="apps/user-application/src/routes/api/auth.$.ts"
          />
        </StepCard>

        <StepCard step={6} title="Client-side integration">
          <p>
            Use the Better Auth client to integrate authentication into your
            React components. The client provides hooks and utilities for
            managing authentication state and user sessions.
          </p>

          <CodeBlock
            language="typescript"
            code={`import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  baseURL: "https://your-domain.com",
});

export const { useSession, signIn, signOut } = authClient;

// Usage in components
export function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <button onClick={() => signOut()}>
        Sign out {session.user.name}
      </button>
    );
  }

  return (
    <button onClick={() => signIn.social({ provider: "google" })}>
      Sign in with Google
    </button>
  );
}`}
            filename="apps/user-application/src/lib/auth-client.ts"
          />
        </StepCard>

        <Callout type="success">
          <p>
            <strong>Authentication Setup Complete!</strong> Your application now
            has a fully configured authentication system with social login,
            session management, and database integration. Users can sign in
            securely using their preferred OAuth providers.
          </p>
        </Callout>
      </div>
    </main>
  );
}
