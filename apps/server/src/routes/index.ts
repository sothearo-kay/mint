import { createRouter } from "@/lib/create-app";

import health from "./health/health.index";

const router = createRouter().route("/", health);

export default router;
export type Router = typeof router;
