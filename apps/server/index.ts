import type { Hono } from "hono";
// eslint-disable-next-line antfu/no-import-dist
import app from "./dist/app.mjs";

export default app as unknown as Hono;
