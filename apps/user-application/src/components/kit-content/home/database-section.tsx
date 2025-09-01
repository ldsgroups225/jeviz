import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Cloud, Server } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function DatabaseSection() {
  const providers = [
    {
      name: "PostgreSQL",
      icon: <Database className="w-6 h-6" />,
      description: "Supabase, Neon, Railway",
      color: "bg-secondary text-secondary-foreground"
    },
    {
      name: "MySQL", 
      icon: <Server className="w-6 h-6" />,
      description: "PlanetScale, Vitess",
      color: "bg-secondary text-secondary-foreground"
    },
    {
      name: "Cloudflare D1",
      icon: <Cloud className="w-6 h-6" />,
      description: "Edge SQLite",
      color: "bg-secondary text-secondary-foreground"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Bring Your Own Database
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Database-agnostic setup with Drizzle ORM. Choose your preferred provider and get started quickly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {providers.map((provider) => (
            <Card key={provider.name} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${provider.color} flex items-center justify-center mb-3`}>
                  {provider.icon}
                </div>
                <CardTitle className="text-lg">{provider.name}</CardTitle>
                <CardDescription>{provider.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="secondary" className="text-xs">
                    <img src="/cloudflare.png" alt="Cloudflare" className="w-3 h-3 mr-1" />
                    Edge Compatible
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Production-ready with automatic migrations and type safety
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/database">
            <Button size="lg">
              <Database className="w-5 h-5 mr-2" />
              Setup Database
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}