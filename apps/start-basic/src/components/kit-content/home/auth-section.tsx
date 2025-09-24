import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Key, Zap } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function AuthSection() {
  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Social Authentication",
      description: "Google, GitHub, Discord and more OAuth providers",
      color: "bg-secondary text-secondary-foreground",
    },
    {
      icon: <Key className="w-6 h-6" />,
      title: "Session Management",
      description: "Secure token-based sessions with auto-refresh",
      color: "bg-secondary text-secondary-foreground",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Edge Compatible",
      description: "Optimized for serverless and edge environments",
      color: "bg-secondary text-secondary-foreground",
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/better-auth.png" alt="Better Auth" className="w-8 h-8" />
            <h2 className="text-3xl font-bold tracking-tight">
              Flexible Auth with Better Auth
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive authentication solution that works seamlessly with any
            database and deployment environment
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-3`}
                >
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="bg-muted rounded-xl p-6 mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="secondary">TypeScript First</Badge>
            <Badge variant="secondary">Database Agnostic</Badge>
            <Badge variant="secondary">OAuth 2.0</Badge>
            <Badge variant="secondary">Session Tokens</Badge>
            <Badge variant="secondary">CSRF Protection</Badge>
            <Badge variant="secondary">Rate Limiting</Badge>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg">
                <Shield className="w-5 h-5 mr-2" />
                Setup Authentication
              </Button>
            </Link>
            <Link to="/auth/client">
              <Button size="lg" variant="outline">
                <Users className="w-5 h-5 mr-2" />
                Client Integration
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
