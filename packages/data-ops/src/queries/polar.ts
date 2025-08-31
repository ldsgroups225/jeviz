import { getDb } from "@/database/setup";
import { subscriptions } from "@/drizzle/schema";

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
