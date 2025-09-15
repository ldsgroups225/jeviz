import { getAuth } from "@repo/data-ops/auth/server";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

export const userSession = createServerFn().handler(async () => {
  const auth = getAuth();
  const webRequest = getRequest();
  const session = await auth.api.getSession(webRequest);
  return session;
});
