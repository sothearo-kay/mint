import { serve } from "@hono/node-server";
import { env } from "@mint/env/server";

import app from "./app";

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`Mint API running on http://localhost:${info.port}`);
    console.log(`Docs available at http://localhost:${info.port}/docs`);
  },
);
