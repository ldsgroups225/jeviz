import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  PageTitle,
  InfoSection,
  CodeBlock,
  StepCard,
  Callout,
} from "@/components/kit-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_static/auth/client")({
  component: RouteComponent,
});

function RouteComponent() {
  const [activeTab, setActiveTab] = useState("client-side");
  return (
    <main className="pt-20 pb-16 mt-6">
      <div className="container mx-auto max-w-4xl px-4">
        <PageTitle
          badge="Client Guide"
          title="Better Auth Client Integration"
          subtitle="Implement secure authentication on the client side with React hooks"
        />

        <InfoSection title="Overview">
          <p>
            The Better Auth React client provides a seamless integration for
            managing authentication state in your React application. It offers
            type-safe hooks, automatic session management, and optimized caching
            for a smooth user experience.
          </p>
          <p>The client-side integration includes:</p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>
              <strong>React Hooks</strong> - useSession and other authentication
              hooks
            </li>
            <li>
              <strong>Automatic Session Management</strong> - Handles token
              refresh and session validation
            </li>
            <li>
              <strong>Social Authentication</strong> - Streamlined OAuth flows
              with redirect handling
            </li>
            <li>
              <strong>Route Protection</strong> - Easy implementation of
              authenticated routes
            </li>
            <li>
              <strong>TypeScript Support</strong> - Full type safety for user
              data and session state
            </li>
          </ul>
        </InfoSection>

        <StepCard step={1} title="Setting up the Better Auth React Client">
          <p>
            Create a Better Auth client instance that communicates with your
            backend authentication endpoints. This client provides React hooks
            and methods for managing authentication state throughout your
            application.
          </p>
          <p className="mt-3">
            The client automatically handles session management, token refresh,
            and provides optimized caching for authentication state.
          </p>

          <CodeBlock
            language="typescript"
            code={`import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();`}
            filename="src/components/auth/client.ts"
          />

          <Callout type="info">
            <p>
              <strong>Automatic Configuration:</strong> The client automatically
              detects the base URL and configures endpoints based on your server
              setup. For custom configurations, you can pass options like{" "}
              <code>baseURL</code> to override defaults.
            </p>
          </Callout>
        </StepCard>

        <StepCard step={2} title="Implementing Login and Logout Components">
          <p>
            Better Auth provides simple methods for social authentication and
            session management. The login component handles OAuth flows while
            the logout functionality can be integrated into user account
            interfaces.
          </p>

          <div className="mt-4 space-y-6">
            <div>
              <h4 className="font-semibold  mb-3">
                Google OAuth Login Component
              </h4>
              <p className="text-sm  mb-3">
                The login component uses <code>authClient.signIn.social()</code>
                to initiate OAuth flows with redirect handling.
              </p>
              <CodeBlock
                language="typescript"
                code={`import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "./client";

export function GoogleLogin() {
  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/app",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleGoogleSignIn}
            className="w-full h-12 text-base"
            variant="outline"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              {/* Google icon SVG paths */}
            </svg>
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}`}
                filename="src/components/auth/google-login.tsx"
              />
            </div>

            <div>
              <h4 className="font-semibold  mb-3">
                Account Dialog with Logout
              </h4>
              <p className="text-sm  mb-3">
                The account dialog demonstrates session state management and
                logout functionality using <code>useSession</code> hook.
              </p>
              <CodeBlock
                language="typescript"
                code={`import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authClient } from "./client";
import { LogOut, Palette } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface AccountDialogProps {
  children: React.ReactNode;
}

export function AccountDialog({ children }: AccountDialogProps) {
  const { data: session } = authClient.useSession();

  const signOut = async () => {
    await authClient.signOut();
  };

  if (!session) {
    return null;
  }

  const user = session.user;
  const fallbackText = user.name
    ? user.name.charAt(0).toUpperCase()
    : user.email?.charAt(0).toUpperCase() || "U";

  return (
    <Dialog>
      {children}
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center pb-4">
          <DialogTitle>Account</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-6 py-6">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={user.image || undefined}
              alt={user.name || "User"}
            />
            <AvatarFallback className="text-2xl font-semibold">
              {fallbackText}
            </AvatarFallback>
          </Avatar>
          <div className="text-center space-y-1">
            {user.name && (
              <div className="text-lg font-semibold">{user.name}</div>
            )}
            {user.email && (
              <div className="text-sm text-muted-foreground">{user.email}</div>
            )}
          </div>
          <div className="flex flex-col gap-4 w-full mt-6">
            <div className="flex items-center justify-between w-full py-3 px-4 rounded-lg border bg-card">
              <span className="text-sm font-medium flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Theme
              </span>
              <ThemeToggle />
            </div>
            <Button
              onClick={signOut}
              variant="outline"
              size="lg"
              className="w-full gap-2"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}`}
                filename="src/components/auth/account-dialog.tsx"
              />
            </div>
          </div>

          <Callout type="success">
            <p>
              <strong>Session Management:</strong> The <code>useSession</code>
              hook automatically manages authentication state, handles token
              refresh, and provides real-time updates when the session changes.
            </p>
          </Callout>
        </StepCard>

        <StepCard step={3} title="Protecting Routes with Authentication">
          <p>
            Better Auth provides two approaches for route protection:
            client-side authentication checks and server-side rendering (SSR)
            protection. Both patterns ensure users must be authenticated to
            access certain areas of your application.
          </p>
          <p className="mt-3">
            Choose the appropriate method based on your security requirements
            and user experience needs.
          </p>

          <Tabs className="mt-4" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="client-side">Client-side</TabsTrigger>
              <TabsTrigger value="ssr">Server-side (SSR)</TabsTrigger>
            </TabsList>

            <TabsContent value="client-side">
              <CodeBlock
                language="typescript"
                code={`import { authClient } from "@/components/auth/client";
import { GoogleLogin } from "@/components/auth/google-login";
import { Sidebar } from "@/components/common/sidebar";
import { Header } from "@/components/common/header";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed")({
  component: RouteComponent,
});

function RouteComponent() {
  const session = authClient.useSession();

  return (
    <>
      {session.isPending ? (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div>Loading...</div>
        </div>
      ) : session.data ? (
        <div className="flex h-screen bg-background">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-6">
              <Outlet />
            </main>
          </div>
        </div>
      ) : (
        <GoogleLogin />
      )}
    </>
  );
}`}
                filename="src/routes/_authed/route.tsx"
              />
            </TabsContent>

            <TabsContent value="ssr">
              <CodeBlock
                language="typescript"
                code={`import { GoogleLogin } from "@/components/auth/google-login";
import { Header } from "@/components/common/header";
import { Sidebar } from "@/components/common/sidebar";
import { userSession } from "@/server/functions/auth";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed")({
  beforeLoad: async () => {
    const session = await userSession();
    if (!session) {
      throw new Error("USER_NOT_AUTHENTICATED");
    }
  },
  component: RouteComponent,
  errorComponent: ({ error }) => {
    if (error.message === "USER_NOT_AUTHENTICATED") {
      return <GoogleLogin />;
    }
  },
});

function RouteComponent() {
  return (
    <>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}`}
                filename="src/routes/_authed/route.tsx"
              />
            </TabsContent>
          </Tabs>

          <div className="mt-4 space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                Key Differences Between Approaches
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium text-foreground mb-2">
                    Client-side
                  </h5>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    <li>Authentication check happens in the browser</li>
                    <li>Loading state while checking session</li>
                    <li>Better for dynamic user experiences</li>
                    <li>Requires handling pending states</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-foreground mb-2">
                    Server-side (SSR)
                  </h5>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    <li>Authentication validated on server</li>
                    <li>No loading state - immediate auth decision</li>
                    <li>Better security and SEO</li>
                    <li>
                      Uses <code>beforeLoad</code> and error handling
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">
                Layout Components
              </h4>
              <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                <li>
                  <code>&lt;Sidebar /&gt;</code> - Navigation component with
                  user profile
                </li>
                <li>
                  <code>&lt;Header /&gt;</code> - Top bar with notifications and
                  sign out
                </li>
                <li>
                  <code>&lt;Outlet /&gt;</code> - Renders child routes within
                  the layout
                </li>
              </ul>
            </div>
          </div>

          <Callout type="warning">
            <p>
              <strong>Important Notes:</strong> All routes under{" "}
              <code>/_authed</code> will automatically inherit authentication
              protection. For SSR logout functionality, you'll need additional
              logic to redirect or refresh the page after sign out, as the
              server-side session validation won't automatically re-run.
            </p>
          </Callout>
        </StepCard>

        <Callout type="success">
          <p>
            <strong>Client Integration Complete!</strong> Your React application
            now has a fully integrated authentication system with social login,
            session management, and route protection. Users can seamlessly sign
            in, access protected content, and manage their accounts with a
            polished user experience.
          </p>
        </Callout>
      </div>
    </main>
  );
}
