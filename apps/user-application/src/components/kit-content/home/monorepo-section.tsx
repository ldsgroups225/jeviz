import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, FolderTree, Zap } from "lucide-react";

export function MonorepoSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Monorepo with PNPM Workspaces
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Organized, scalable architecture that keeps your code clean and dependencies efficient
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Package className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-lg">Shared Packages</CardTitle>
              <CardDescription>
                Reusable components, utilities, and data operations across apps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• UI Components</li>
                <li>• Database Operations</li>
                <li>• Auth Configuration</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FolderTree className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-lg">Clean Structure</CardTitle>
              <CardDescription>
                Organized apps, packages, and tooling in logical directories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• apps/ - Applications</li>
                <li>• packages/ - Shared code</li>
                <li>• tooling/ - Build & config</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-lg">Fast Development</CardTitle>
              <CardDescription>
                PNPM workspaces with efficient linking and caching
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Smart dependency linking</li>
                <li>• Instant hot reloading</li>
                <li>• Optimized builds</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button size="lg">
            <img src="/pnpm.webp" alt="PNPM" className="w-5 h-5 mr-2" />
            Explore Architecture
          </Button>
        </div>
      </div>
    </section>
  );
}