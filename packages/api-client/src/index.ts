import type { Router } from "server/routes";
import { hc } from "hono/client";

const client = hc<Router>("");
export type Client = typeof client;

export default (...args: Parameters<typeof hc>): Client => hc<Router>(...args);
