import { useState } from "react";
import {
  CodeBlock,
  InfoSection,
  PageTitle,
  StepCard,
  Callout,
} from "@/components/kit-content";
import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_static/database/queries")({
  component: RouteComponent,
});

function RouteComponent() {
  const [activeTab, setActiveTab] = useState("middleware");
  console.log("activeTab", activeTab);
  const queryExamples = {
    create: {
      title: "Creating Database Queries",
      code: `import { getDb } from "@/database/setup";
import { subscriptions } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function updateSubscription(data: {
  userId: string;
  status: string;
  subscriptionId: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
  startedAt?: string;
  productId: string;
}) {
  const db = getDb();
  await db
    .insert(subscriptions)
    .values({
      userId: data.userId,
      status: data.status,
      subscriptionId: data.subscriptionId,
      currentPeriodStart: data.currentPeriodStart,
      currentPeriodEnd: data.currentPeriodEnd,
      cancelAtPeriodEnd: data.cancelAtPeriodEnd,
      startedAt: data.startedAt,
      productId: data.productId,
    })
    .onConflictDoUpdate({
      target: [subscriptions.userId],
      set: {
        status: data.status,
        subscriptionId: data.subscriptionId,
        currentPeriodStart: data.currentPeriodStart,
        currentPeriodEnd: data.currentPeriodEnd,
        cancelAtPeriodEnd: data.cancelAtPeriodEnd,
        startedAt: data.startedAt,
        productId: data.productId,
      },
    });
}

export async function getSubscription(userId: string) {
  const db = getDb();
  const subscription = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId));
  return subscription;
}`,
    },
    usage: {
      title: "Using Queries in Server Functions",
      code: `import { createServerFn } from "@tanstack/react-start";
import {
  updateSubscription,
  getSubscription,
} from "@repo/data-ops/queries/polar";
import { protectedFunctionMiddleware } from "@/server/middleware/auth";

export const baseFunction = createServerFn().middleware([
  protectedFunctionMiddleware,
]);

export const collectSubscription = baseFunction.handler(async (ctx) => {
  const subscription = await ctx.context.polar.subscriptions.list({
    externalCustomerId: ctx.context.userId,
  });

  if (subscription.result.items.length === 0) {
    return null;
  }

  const subscriptionItem = subscription.result.items[0];

  // Use the imported query function
  await updateSubscription({
    userId: ctx.context.userId,
    subscriptionId: subscriptionItem.id,
    productId: subscriptionItem.productId,
    status: subscriptionItem.status,
    startedAt: subscriptionItem.startedAt?.toISOString(),
    currentPeriodStart: subscriptionItem.currentPeriodStart?.toISOString(),
    currentPeriodEnd: subscriptionItem.currentPeriodEnd?.toISOString(),
    cancelAtPeriodEnd: subscriptionItem.cancelAtPeriodEnd,
  });

  return subscriptionItem;
});

export const getUserSubscription = baseFunction.handler(async (ctx) => {
  // Use the imported query function
  const subscription = await getSubscription(ctx.context.userId);
  if (subscription.length === 0) {
    return null;
  }
  return subscription[0];
});`,
    },
    middleware: {
      title: "Using Queries in Middleware",
      code: `import { createMiddleware } from "@tanstack/react-start";
import { getUserByEmail } from "@repo/data-ops/queries/users";

export const userLookupMiddleware = createMiddleware({
  type: "function",
}).server(async ({ next, context }) => {
  // Use imported query function in middleware
  const user = await getUserByEmail(context.email);

  if (!user) {
    throw new Error("User not found");
  }

  return next({
    context: {
      ...context,
      user,
    },
  });
});`,
    },
    api: {
      title: "Using Queries in REST API Routes",
      code: `import { Subscription } from "@polar-sh/sdk/models/components/subscription.js";
import { Webhooks } from "@polar-sh/tanstack-start";
import { updateSubscription } from "@repo/data-ops/queries/polar";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { env } from "cloudflare:workers";

async function handleSubscription(payload: { data: Subscription }) {
  const { data } = payload;
  if (!data.customer.externalId) {
    console.error("Missing customer external ID");
    return;
  }

  // Use the imported query function in webhook handler
  await updateSubscription({
    userId: data.customer.externalId,
    subscriptionId: data.id,
    productId: data.productId,
    status: data.status,
    startedAt: data.startedAt?.toISOString(),
    currentPeriodEnd: data.currentPeriodStart?.toISOString(),
    currentPeriodStart: data.currentPeriodEnd?.toISOString(),
    cancelAtPeriodEnd: data.cancelAtPeriodEnd,
  });
}

export const ServerRoute = createServerFileRoute("/api/webhook/polar").methods({
  POST: Webhooks({
    webhookSecret: env.POLAR_WEBHOOK_SECRET,
    onSubscriptionActive: handleSubscription,
    onSubscriptionCanceled: handleSubscription,
    onSubscriptionCreated: handleSubscription,
    onSubscriptionUpdated: handleSubscription,
    onSubscriptionRevoked: handleSubscription,
    onSubscriptionUncanceled: handleSubscription,
  }),
});`,
    },
  };

  const packageJsonExport = `{
  "name": "@repo/data-ops",
  "exports": {
    "./queries/*": {
      "default": "./dist/queries/*.js",
      "types": "./dist/queries/*.d.ts"
    }
  },
  "scripts": {
    "build": "tsc -p tsconfig.json --outDir ./dist && tsc-alias"
  }
}`;

  const usageImport = `{
  "name": "user-application",
  "dependencies": {
    "@repo/data-ops": "workspace:^"
  }
}`;

  return (
    <main className="pt-20 pb-16 mt-6">
      <div className="container mx-auto max-w-4xl px-4">
        <PageTitle
          badge="Development Guide"
          title="Database Queries"
          subtitle="Create reusable, type-safe database queries for your serverless application"
        />

        <InfoSection title="Overview">
          <p>
            The <strong>data-ops package</strong> serves as the centralized hub
            for all database operations in your monorepo. By organizing your
            queries here, you can create reusable, type-safe database functions
            that can be shared across multiple applications and services.
          </p>
          <p>
            This approach promotes code reuse, maintains consistency across your
            applications, and ensures that database logic is properly tested and
            maintained in one location.
          </p>
        </InfoSection>

        <Callout type="info">
          <p>
            <strong>Tip:</strong> Queries defined in the data-ops package are
            automatically type-safe when using Drizzle ORM, giving you excellent
            developer experience with autocompletion and compile-time error
            checking.
          </p>
        </Callout>

        <StepCard step={1} title="Create Your Database Queries">
          <p>
            Database queries are organized in the{" "}
            <code>packages/data-ops/src/queries/</code> directory. Each file
            typically groups related queries together (e.g., user operations,
            subscription management, etc.).
          </p>
          <p className="mt-3">
            All queries use the <code>getDb()</code> function to access the
            database instance, ensuring consistent connection management across
            your serverless functions.
          </p>

          <CodeBlock
            language="typescript"
            code={queryExamples.create.code}
            filename="packages/data-ops/src/queries/polar.ts"
          />

          <Callout type="info">
            <p>
              <strong>Best Practice:</strong> Use descriptive function names and
              include proper TypeScript types for all parameters and return
              values. This makes your queries self-documenting and easier to
              use.
            </p>
          </Callout>
        </StepCard>

        <StepCard step={2} title="Export Queries in Package Configuration">
          <p>
            To make your queries available to other packages in your monorepo,
            you need to configure the exports in <code>package.json</code> and
            build the package.
          </p>
          <p className="mt-3">
            The data-ops package is already configured to export all queries
            under the <code>./queries/*</code> path, making them importable from
            other applications.
          </p>

          <CodeBlock
            language="json"
            code={packageJsonExport}
            filename="packages/data-ops/package.json"
          />

          <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <p className="text-yellow-800">
              <strong>Important:</strong> After creating or modifying queries,
              run <code>pnpm run build</code> in the data-ops package to compile
              the TypeScript and make the queries available to other
              applications.
            </p>
          </div>
        </StepCard>

        <StepCard step={3} title="Install the Data-Ops Package">
          <p>
            Your applications need to include the data-ops package as a
            dependency to use the shared queries. In a monorepo setup, this is
            typically done using workspace references.
          </p>

          <CodeBlock
            language="json"
            code={usageImport}
            filename="apps/user-application/package.json"
          />

          <p className="mt-3 text-sm ">
            The <code>workspace:^</code> syntax tells pnpm to use the local
            workspace version of the package, ensuring you're always using the
            latest queries from your data-ops package.
          </p>
        </StepCard>

        <StepCard step={4} title="Use Queries in Your Application">
          <p>
            Once your queries are built and exported, you can import and use
            them anywhere in your application. Here are common usage patterns:
          </p>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="usage">Server Functions</TabsTrigger>
              <TabsTrigger value="middleware">Middleware</TabsTrigger>
              <TabsTrigger value="api">REST API</TabsTrigger>
            </TabsList>

            <TabsContent value="usage" className="space-y-4">
              <div>
                <h4 className="font-semibold  mb-2">
                  Using in TanStack Start Server Functions
                </h4>
                <p className=" mb-4">
                  Import your queries directly into server functions for
                  handling API requests and data operations.
                </p>
                <CodeBlock
                  language="typescript"
                  code={queryExamples.usage.code}
                  filename="apps/user-application/src/server/functions/payments.ts"
                />
              </div>
            </TabsContent>

            <TabsContent value="middleware" className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">
                  Using in Server Middleware
                </h4>
                <p className=" mb-4">
                  Queries can also be used in middleware for authentication,
                  authorization, and request preprocessing.
                </p>
                <CodeBlock
                  language="typescript"
                  code={queryExamples.middleware.code}
                  filename="apps/user-application/src/server/middleware/user.ts"
                />
              </div>
            </TabsContent>

            <TabsContent value="api" className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">
                  Using in REST API Routes & Webhooks
                </h4>
                <p className=" mb-4">
                  Import and use queries in API routes for handling webhooks,
                  REST endpoints, and other server-side API operations.
                </p>
                <CodeBlock
                  language="typescript"
                  code={queryExamples.api.code}
                  filename="apps/user-application/src/routes/api/webhook/polar.ts"
                />
              </div>
            </TabsContent>
          </Tabs>
        </StepCard>

        <InfoSection title="Benefits of Centralized Queries">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">🔄 Code Reuse</h4>
              <p>
                Write database queries once and use them across multiple
                applications and services in your monorepo.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🛡️ Type Safety</h4>
              <p>
                Drizzle ORM provides full TypeScript support with compile-time
                type checking and excellent autocompletion.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🧪 Easier Testing</h4>
              <p>
                Centralized queries can be easily unit tested, ensuring your
                database logic is reliable and well-tested.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">📦 Maintainability</h4>
              <p>
                Keep all database logic in one place, making it easier to update
                schemas and optimize queries as your application grows.
              </p>
            </div>
          </div>
        </InfoSection>
      </div>
    </main>
  );
}
