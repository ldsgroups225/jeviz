import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";

import { createRouter } from "./router";
// import { initDatabase } from "@repo/data-ops/database/setup";
// import { setAuth } from "@repo/data-ops/auth/server";

const fetch = createStartHandler({
  createRouter: createRouter,
})(defaultStreamHandler);

export default {
  fetch: (request: Request) => {
    return fetch(request);
  },
};
