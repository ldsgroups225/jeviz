import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
// import {
//   updateSubscription,
//   getSubscription,
// } from "@repo/data-ops/queries/polar";
import { z } from "zod";
import { protectedFunctionMiddleware } from "@/server/middleware/auth";
import { polarMiddleware } from "@/server/middleware/polar";

const PaymentLink = z.object({
  productId: z.string(),
});

export const baseFunction = createServerFn().middleware([
  protectedFunctionMiddleware,
  polarMiddleware,
]);

export const getProducts = baseFunction.handler(async (ctx) => {
  const products = await ctx.context.polar.products.list({
    isArchived: false,
  });

  return products.result.items;
});

export const createPaymentLink = baseFunction
  .validator((data: z.infer<typeof PaymentLink>) => {
    return PaymentLink.parse(data);
  })
  .handler(async (ctx) => {
    const ip = getRequestIP();
    const checkout = await ctx.context.polar.checkouts.create({
      products: [ctx.data.productId],
      externalCustomerId: ctx.context.userId,
      successUrl: `http://localhost:3000/app/polar/checkout/success?checkout_id={CHECKOUT_ID}`,
      customerIpAddress: ip,
      customerEmail: ctx.context.email,
    });
    return checkout;
  });

export const validPayment = baseFunction
  .validator((data: string) => {
    console.log("validatePayment", data);
    if (typeof data !== "string") {
      throw new Error("Invalid data type");
    }
    return data;
  })
  .handler(async (ctx) => {
    const payment = await ctx.context.polar.checkouts.get({
      id: ctx.data,
    });
    console.log(payment);
    if (payment.status === "succeeded") {
      return true;
    }
    return false;
  });

export const collectSubscription = baseFunction.handler(async (ctx) => {
  // const subscription = await ctx.context.polar.subscriptions.list({
  //   externalCustomerId: ctx.context.userId,
  // });
  // if (subscription.result.items.length === 0) {
  //   return null;
  // }
  // const subscriptionItem = subscription.result.items[0];
  // await updateSubscription({
  //   userId: ctx.context.userId,
  //   subscriptionId: subscriptionItem.id,
  //   productId: subscriptionItem.productId,
  //   status: subscriptionItem.status,
  //   startedAt: subscriptionItem.startedAt?.toISOString(),
  //   currentPeriodStart: subscriptionItem.currentPeriodStart?.toISOString(),
  //   currentPeriodEnd: subscriptionItem.currentPeriodEnd?.toISOString(),
  //   cancelAtPeriodEnd: subscriptionItem.cancelAtPeriodEnd,
  // });
  // console.log("collectSubscription", subscriptionItem);
  // return subscriptionItem;
  return {} as any;
});

export const getUserSubscription = baseFunction.handler(async (ctx) => {
  // const subscription = await getSubscription(ctx.context.userId);
  // if (subscription.length === 0) {
  //   return null;
  // }
  // return subscription[0];
  return {} as any;
});
