import { createStart } from '@tanstack/react-start';

declare module '@tanstack/react-start' {
  type Register = {
    server: {
      requestContext: {
        fromFetch: boolean;
      };
    };
  };
}

export const startInstance = createStart(() => {
  return {
    defaultSsr: true,
  };
});

startInstance.createMiddleware().server(({ next }) => {
  return next({
    context: {
      fromStartInstanceMw: true,
    },
  });
});
