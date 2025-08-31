import { getAuth } from "@repo/data-ops/auth/server";
import { createServerFileRoute } from "@tanstack/react-start/server";

export const ServerRoute = createServerFileRoute("/api/auth/$").methods({
  GET: ({ request }) => {
    const auth = getAuth();
    return auth.handler(request);
  },
  POST: ({ request }) => {
    const auth = getAuth();
    return auth.handler(request);
  },
});
