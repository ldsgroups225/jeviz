import { createFileRoute, Outlet } from '@tanstack/react-router';
import { authClient } from '@/lib/auth-client';

export const Route = createFileRoute('/_onboarding')({
  component: OnboardingLayout,
  beforeLoad: async () => {
    // Check if user is authenticated
    const session = await authClient.getSession();
    if (!session) {
      // throw redirect({ to: '/login' });
    }

    // Check if onboarding is already complete
    try {
      // We'll implement this check once we have the data-ops functions
      // const profile = await getUserProfile({ userId: session.user.id });
      // if (profile?.onboardingComplete) {
      //   throw redirect({ to: '/learn' });
      // }
    }
    catch {
      // Continue with onboarding if profile check fails
    }

    return { user: (session as any).user };
  },
});

function OnboardingLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Logo and branding */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary">Jeviz</h1>
            <p className="text-muted-foreground mt-2">
              Ton partenaire pour réussir le BEPC et le BAC
            </p>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}
