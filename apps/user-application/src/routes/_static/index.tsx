import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_static/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main className="flex items-center justify-center min-h-screen pt-20">
      <div className="text-center space-y-8 px-4">
        <div className="space-y-6">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight">
            Build Something
            <span className="block text-primary">Amazing</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The modern way to create beautiful, fast, and scalable applications
          </p>
        </div>
      </div>
    </main>
  );
}
