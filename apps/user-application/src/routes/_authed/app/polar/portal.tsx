import { protectedRequestMiddleware } from "@/server/middleware/auth";
import { Polar } from "@polar-sh/sdk";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { env } from "cloudflare:workers";

export const ServerRoute = createServerFileRoute("/_authed/app/polar/portal")
  .middleware([protectedRequestMiddleware])
  .methods({
    GET: async (ctx) => {
      const polar = new Polar({
        accessToken: env.POLAR_SECRET,
        server: "sandbox",
      });
      const customerSession = await polar.customerSessions.create({
        externalCustomerId: ctx.context.userId,
      });
      return new Response(null, {
        status: 302,
        headers: {
          Location: customerSession.customerPortalUrl,
        },
      });
    },
  });
