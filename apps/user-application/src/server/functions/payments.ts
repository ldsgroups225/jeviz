import { Polar } from "@polar-sh/sdk";
import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { updateSubscription } from "@repo/data-ops/queries/polar";
import { z } from "zod";
import { protectedFunctionMiddleware } from "../middleware/auth";

const PaymentLink = z.object({
  productId: z.string(),
});

const basePaymentFactory = createServerFn().middleware([
  protectedFunctionMiddleware,
]);

export const getProducts = basePaymentFactory.handler(async () => {
  const polar = new Polar({
    accessToken: "polar_oat_GpE7e4VWmLFSAhJkGP7hg83qx4m2FIaLUaMA04TNnoE",
    server: "sandbox",
  });

  const products = await polar.products.list({
    isArchived: false,
  });

  return products.result.items;
});

export const createPaymentLink = basePaymentFactory
  .validator((data: z.infer<typeof PaymentLink>) => {
    return PaymentLink.parse(data);
  })
  .handler(async (ctx) => {
    const polar = new Polar({
      accessToken: "polar_oat_GpE7e4VWmLFSAhJkGP7hg83qx4m2FIaLUaMA04TNnoE",
      server: "sandbox",
    });
    const ip = getRequestIP();
    const checkout = await polar.checkouts.create({
      products: [ctx.data.productId],
      externalCustomerId: ctx.context.userId,
      successUrl: `http://localhost:3000/app/polar-checkout/success?checkout_id={CHECKOUT_ID}`,
      customerIpAddress: ip,
      customerEmail: ctx.context.email,
    });
    return checkout;
  });

export const validPayment = basePaymentFactory
  .validator((data: string) => {
    console.log("validatePayment", data);
    if (typeof data !== "string") {
      throw new Error("Invalid data type");
    }
    return data;
  })
  .handler(async (ctx) => {
    console.log("chandling", ctx.data);
    const polar = new Polar({
      accessToken: "polar_oat_GpE7e4VWmLFSAhJkGP7hg83qx4m2FIaLUaMA04TNnoE",
      server: "sandbox",
    });
    const payment = await polar.checkouts.get({
      id: ctx.data,
    });
    console.log(payment);
    if (payment.status === "succeeded") {
      return true;
    }
    return false;
  });

export const collectSubscription = basePaymentFactory.handler(async (ctx) => {
  const polar = new Polar({
    accessToken: "polar_oat_GpE7e4VWmLFSAhJkGP7hg83qx4m2FIaLUaMA04TNnoE",
    server: "sandbox",
  });
  const subscription = await polar.subscriptions.list({
    externalCustomerId: ctx.context.userId,
  });
  if (subscription.result.items.length === 0) {
    return null;
  }
  const subscriptionItem = subscription.result.items[0];
  await updateSubscription({
    userId: ctx.context.userId,
    subscriptionId: subscriptionItem.id,
    productId: subscriptionItem.productId,
    status: subscriptionItem.status,
    startedAt: subscriptionItem.startedAt?.toISOString(),
    currentPeriodStart: subscriptionItem.currentPeriodStart?.toISOString(),
    currentPeriodEnd: subscriptionItem.currentPeriodEnd?.toISOString(),
    cancelAtPeriodEnd: subscriptionItem.cancelAtPeriodEnd,
  });
  console.log("collectSubscription", subscriptionItem);
  return subscriptionItem;
});
