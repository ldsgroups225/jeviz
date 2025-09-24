import { Subscription } from "@polar-sh/sdk/models/components/subscription.js";
import { Webhooks } from "@polar-sh/tanstack-start";
// import { updateSubscription } from "@repo/data-ops/queries/polar";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { env } from "cloudflare:workers";

async function handleSubscription(payload: { data: Subscription }) {
  const { data } = payload;
  if (!data.customer.externalId) {
    console.error("Missing customer external ID");
    return;
  }
  // await updateSubscription({
  //   userId: data.customer.externalId,
  //   subscriptionId: data.id,
  //   productId: data.productId,
  //   status: data.status,
  //   startedAt: data.startedAt?.toISOString(),
  //   currentPeriodEnd: data.currentPeriodStart?.toISOString(),
  //   currentPeriodStart: data.currentPeriodEnd?.toISOString(),
  //   cancelAtPeriodEnd: data.cancelAtPeriodEnd,
  // });
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
});
