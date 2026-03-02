import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { auth } from "@/lib/auth";
import configureOpenAPI from "@/lib/configure-openapi";
import createApp from "@/lib/create-app";
import router from "./routes";

const app = createApp();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(
  "/api/auth/*",
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  c.set("user", session?.user ?? null);
  c.set("session", session?.session ?? null);
  await next();
});

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

configureOpenAPI(app);

app.route("/", router);

export default app;
