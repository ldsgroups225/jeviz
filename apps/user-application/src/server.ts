import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";

import { createRouter } from "./router";
import { initDatabase } from "@repo/data-ops/database/setup";
import { setAuth } from "@repo/data-ops/auth/server";

const fetch = createStartHandler({
  createRouter: createRouter,
})(defaultStreamHandler);

export default {
  fetch: (request: Request, env: Env) => {
    const db = initDatabase(env.DB);
    console.log("fetch", Date.now());
    setAuth({
      socialProviders: {
        google: {
          clientSecret: env.GOOGLE_CLIENT_SECRET,
          clientId: env.GOOGLE_CLIENT_ID,
        },
      },
      adapter: {
        drizzleDb: db,
        provider: "sqlite",
      },
    });
    return fetch(request);
  },
};
