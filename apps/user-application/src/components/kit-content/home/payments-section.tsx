import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Repeat, Globe, TrendingUp } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function PaymentsSection() {
  const features = [
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Subscription Management",
      description: "Recurring billing, upgrades, and customer portals",
      color: "bg-secondary text-secondary-foreground",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Payments",
      description: "Multi-currency support with local payment methods",
      color: "bg-secondary text-secondary-foreground",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Developer First",
      description: "Built for creators, with transparent pricing",
      color: "bg-secondary text-secondary-foreground",
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/polar.png" alt="Polar" className="w-8 h-8 rounded" />
            <h2 className="text-3xl font-bold tracking-tight">
              Payments with Polar
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Developer-focused payment infrastructure with subscription
            management, global coverage, and transparent pricing
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
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Why Polar?</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary">No Setup Fees</Badge>
              <Badge variant="secondary">4% + 40¢ per transaction</Badge>
              <Badge variant="secondary">Quick Payouts</Badge>
              <Badge variant="secondary">Open Source</Badge>
            </div>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Built for developers and creators, Polar offers transparent
              pricing and powerful tools without hidden fees
            </p>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/app/polar/subscriptions" className="inline-block">
              <Button size="lg">
                <CreditCard className="w-5 h-5 mr-2" />
                Setup Payments
              </Button>
            </Link>
            <Button size="lg" variant="outline" asChild>
              <a
                href="https://polar.sh"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe className="w-5 h-5 mr-2" />
                Learn More
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
