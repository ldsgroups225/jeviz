import type { inferRouterContext } from '@tanstack/react-router';
import type { router } from '@/router';

declare module '@tanstack/react-start' {
  interface Register {
    router: inferRouterContext<typeof router> & {
      userId?: string;
    };
  }
}
