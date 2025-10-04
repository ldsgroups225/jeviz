import { Polar } from '@polar-sh/sdk';
import { createFileRoute } from '@tanstack/react-router';
import { env } from 'cloudflare:workers';
import { protectedRequestMiddleware } from '@/core/middleware/auth';

export const Route = createFileRoute('/_auth/app/polar/portal')({
  server: {
    middleware: [protectedRequestMiddleware],
    handlers: {
      GET: async (ctx) => {
        const polar = new Polar({
          // @ts-expect-error - env.POLAR_SECRET type not properly inferred from Cloudflare env
          accessToken: env.POLAR_SECRET,
          server: 'sandbox',
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
    },
  },
});
