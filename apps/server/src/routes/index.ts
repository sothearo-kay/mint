import { createRouter } from "@/lib/create-app";

import categories from "./categories/categories.index";
import health from "./health/health.index";
import insights from "./insights/insights.index";
import settings from "./settings/settings.index";
import transactions from "./transactions/transactions.index";

const router = createRouter()
  .route("/", health)
  .route("/api", categories)
  .route("/api", transactions)
  .route("/api", insights)
  .route("/api", settings);

export default router;
export type Router = typeof router;
