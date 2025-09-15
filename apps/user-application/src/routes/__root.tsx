import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  Outlet,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { ThemeProvider, useTheme } from "@/components/theme-provider";
import { NotFoundPage } from "@/components/common/not-found-page";

import type { QueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

export interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  loader: async () => {
    // To avoid the theme flicker, you can save the theme a KV
    // and pass it into the theme provider
  },
  component: RootComponent,
  notFoundComponent: NotFoundPage,
});

function RootComponent() {
  return (
    <ThemeProvider>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </ThemeProvider>
  );
}

function RootDocument({ children }: PropsWithChildren) {
  const { theme } = useTheme();
  return (
    <html lang="en" className={theme} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
