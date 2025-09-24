import { useState } from "react";
import {
  CodeBlock,
  InfoSection,
  PageTitle,
  StepCard,
} from "@/components/kit-content";
import { databaseConfigs } from "@/components/kit-content/content";
import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  drizzleDbConfigs,
  drizzleKitConfigs,
} from "@/components/kit-content/content/database-configs";

export const Route = createFileRoute("/_static/database/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [activeTab, setActiveTab] = useState("postgresql");

  return (
    <main className="pt-20 pb-16 mt-6">
      <div className="container mx-auto max-w-4xl px-4">
        <PageTitle
          badge="Setup Guide"
          title="Serverless Database"
          subtitle="Configure your database for edge connections"
        />
        <InfoSection title="Overview">
          <p>
            Because edge request invocations run in isolation, database
            connections must be proxied through an HTTP server in order to not
            overwhelm database connections with too many concurrent connections.
          </p>
          <p>
            Fortunately, most popular modern database providers offer{" "}
            <strong>managed solutions</strong> that handle proxied requests
            automatically, making it easy to connect from serverless and edge
            environments:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>
              <strong>
                <a
                  href="https://planetscale.com/docs/vitess/tutorials/planetscale-serverless-driver"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  PlanetScale
                </a>
              </strong>{" "}
              for MySQL and PostgreSQL with their serverless driver
            </li>
            <li>
              <strong>
                <a
                  href="https://supabase.com/docs/guides/database/connecting-to-postgres#supavisor-transaction-mode"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Supabase
                </a>
              </strong>{" "}
              with Supavisor transaction mode for PostgreSQL
            </li>
            <li>
              <strong>
                <a
                  href="https://neon.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Neon
                </a>
              </strong>{" "}
              for PostgreSQL with built-in connection pooling
            </li>
            <li>
              <strong>
                <a
                  href="https://developers.cloudflare.com/d1/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Cloudflare D1
                </a>
              </strong>{" "}
              for SQLite with edge-native architecture
            </li>
            <li>
              <strong>
                <a
                  href="https://turso.tech/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Turso
                </a>
              </strong>{" "}
              for SQLite with edge replication
            </li>
          </ul>
        </InfoSection>
        <StepCard step={1} title="Choose a database">
          <p>
            For your serverless application, you'll need to select a database
            provider that supports edge environments. Here are the top options:
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <h4 className="font-semibold ">Recommended: PlanetScale</h4>
              <p className="">
                <strong>PlanetScale</strong> offers exceptional developer
                experience with <strong>branching workflows</strong>, automatic
                scaling, and reliable serverless connections. Their
                MySQL-compatible service includes{" "}
                <strong>zero-downtime schema changes</strong>.
              </p>
            </div>

            <div>
              <h4 className="font-semibold ">
                Budget-Friendly Options with Free Tiers
              </h4>
              <p className=" mb-2">
                If you're on a budget, these providers offer generous free
                tiers:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2 ">
                <li>
                  <strong>Supabase</strong> - Full-stack platform with
                  PostgreSQL and real-time features
                </li>
                <li>
                  <strong>Neon</strong> - PostgreSQL with{" "}
                  <strong>instant branching</strong> and auto-scaling
                </li>
                <li>
                  <strong>Turso</strong> - Global SQLite with edge replication
                  for ultra-low latency
                </li>
                <li>
                  <strong>Cloudflare D1</strong> - Serverless SQLite that runs
                  on Cloudflare's edge network
                </li>
              </ul>
            </div>
          </div>

          <p className="mt-4 text-sm ">
            The budget-friendly options above offer{" "}
            <strong>generous free tiers</strong> to get you started without
            upfront costs.
          </p>
        </StepCard>
        <StepCard step={2} title="Configure the database connection">
          <p>
            In the <code>data-ops</code> package within your monorepo, you'll
            configure your database connection to manage schemas and create
            shareable queries across your application. This centralized approach
            ensures consistent database operations throughout your project.
          </p>
          <p className="mt-3">
            The configuration will be defined in the{" "}
            <strong>data-ops package</strong>, which serves as the central hub
            for all database-related operations, including migrations, schema
            management, and query definitions that can be shared across
            different parts of your application.
          </p>
          <Tabs className="mt-3" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="postgresql">PostgreSQL</TabsTrigger>
              <TabsTrigger value="mysql">MySQL</TabsTrigger>
              <TabsTrigger value="cloudflare_d1">Cloudflare D1</TabsTrigger>
            </TabsList>
            {Object.entries(databaseConfigs).map(([key, config]) => (
              <TabsContent key={key} value={key}>
                <CodeBlock
                  code={config.code}
                  filename="packages/data-ops/.env"
                />
              </TabsContent>
            ))}
          </Tabs>
        </StepCard>
        <StepCard step={3} title="Setup Drizzle Kit">
          <p>
            Drizzle Kit helps you manage your database schema and generate
            TypeScript types automatically. In the <code>data-ops</code> package
            within your monorepo, you'll configure Drizzle Kit to connect to
            your database and pull existing schemas into your project.
          </p>
          <p className="mt-3">
            After configuring Drizzle Kit, you can run{" "}
            <code>pnpm run drizzle:pull</code> to pull in existing database
            schemas from your database to the project. The generated schemas
            will be available in <code>src/drizzle/schema.ts</code>, which you
            can then use to create type-safe queries throughout your
            application.
          </p>
          <Tabs className="mt-3" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="postgresql">PostgreSQL</TabsTrigger>
              <TabsTrigger value="mysql">MySQL</TabsTrigger>
              <TabsTrigger value="cloudflare_d1">Cloudflare D1</TabsTrigger>
            </TabsList>
            {Object.entries(drizzleKitConfigs).map(([key, config]) => (
              <TabsContent key={key} value={key}>
                <CodeBlock
                  language="typescript"
                  code={config.code}
                  filename="packages/data-ops/drizzle.config.ts"
                />
              </TabsContent>
            ))}
          </Tabs>
        </StepCard>
        <StepCard step={4} title="Database Runtime Client">
          <p>
            When working with serverless environments, database connections are
            typically established at runtime, during the execution of your
            serverless function. This approach allows for efficient management
            of database resources and ensures that connections are only active
            when needed.
          </p>
          <p className="mt-3">
            To streamline database interactions within your serverless
            application, it's my preference to initialize your Drizzle database
            instance at the beginning of each serverless invocation. This
            practice ensures that the database connection is readily available
            throughout the function's execution, eliminating the need to
            repeatedly define and inject the database instance. By initializing
            the database and using the <code>getDb()</code> function, you can
            access your database with ease, creating type-safe queries
            throughout your application without the need for top-level
            declarations or complex dependency injection.
          </p>
          <Tabs className="mt-3" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="postgresql">PostgreSQL (Neon)</TabsTrigger>
              <TabsTrigger value="mysql">MySQL (Planetscale)</TabsTrigger>
              <TabsTrigger value="cloudflare_d1">Cloudflare D1</TabsTrigger>
            </TabsList>
            {Object.entries(drizzleDbConfigs).map(([key, config]) => (
              <TabsContent key={key} value={key}>
                <CodeBlock
                  language="typescript"
                  code={config.code}
                  filename="packages/data-ops/database/setup.ts"
                />
              </TabsContent>
            ))}
          </Tabs>
        </StepCard>
      </div>
    </main>
  );
}
