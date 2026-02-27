import { cors } from "hono/cors";
import { logger } from "hono/logger";

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

configureOpenAPI(app);

app.route("/", router);

export default app;
