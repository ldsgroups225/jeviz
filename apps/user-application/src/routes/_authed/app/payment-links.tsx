import { createPaymentLink, getProducts } from "@/server/functions/payments";
import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

export const Route = createFileRoute("/_authed/app/payment-links")({
  component: RouteComponent,
  loader: async () => {
    return await getProducts();
  },
});

function RouteComponent() {
  const products = Route.useLoaderData();

  const checkoutMutation = useMutation({
    mutationFn: async (productId: string) => {
      return await createPaymentLink({
        data: {
          productId,
        },
      });
    },
  });

  const redirectToCheckout = (productId: string) => {
    checkoutMutation.mutate(productId, {
      onSuccess(data) {
        window.location.href = data.url;
      },
    });
  };

  const formatPrice = (price: any) => {
    if (!price || !price.priceCurrency) {
      return "Price unavailable";
    }

    if (price.amountType === "fixed" && price.priceAmount) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: price.priceCurrency.toUpperCase(),
      }).format(price.priceAmount / 100);
    }

    if (price.amountType === "custom") {
      const min = price.minimumAmount ? price.minimumAmount / 100 : 0;
      const max = price.maximumAmount ? price.maximumAmount / 100 : null;
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: price.priceCurrency.toUpperCase(),
      });

      if (max) {
        return `${formatter.format(min)} - ${formatter.format(max)}`;
      }
      return `From ${formatter.format(min)}`;
    }

    return "Custom pricing";
  };

  const getFeatures = (metadata: Record<string, any>) => {
    return Object.entries(metadata)
      .filter(([key]) => key.includes("feature"))
      .map(([_, value]) => value);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-muted-foreground">
          Select the perfect plan for your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products
          .sort((a, b) => {
            const aAmount =
              a.prices[0]?.amountType === "fixed" ? a.prices[0].priceAmount : 0;
            const bAmount =
              b.prices[0]?.amountType === "fixed" ? b.prices[0].priceAmount : 0;
            return aAmount - bAmount;
          })
          .map((product) => {
            const price = product.prices[0];
            const features = getFeatures(product.metadata);

            return (
              <Card key={product.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                    {product.isRecurring && (
                      <Badge variant="secondary">
                        {product.recurringInterval}
                      </Badge>
                    )}
                  </div>
                  {product.description && (
                    <CardDescription>{product.description}</CardDescription>
                  )}
                </CardHeader>

                <CardContent>
                  <div className="mb-6">
                    <div className="text-3xl font-bold">
                      {formatPrice(price)}
                    </div>
                    {price.type === "recurring" && (
                      <div className="text-sm text-muted-foreground">
                        per {price.recurringInterval}
                      </div>
                    )}
                  </div>

                  {features.length > 0 && (
                    <div className="space-y-3 mb-6">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    disabled={checkoutMutation.isPending}
                    onClick={() => redirectToCheckout(price.productId)}
                    className="w-full"
                    size="lg"
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
}
