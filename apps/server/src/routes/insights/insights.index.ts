import { createRouter } from "@/lib/create-app";
import * as handlers from "./insights.handler";
import * as routes from "./insights.routes";

const router = createRouter()
  .openapi(routes.get, handlers.get)
  .openapi(routes.getBreakdown, handlers.breakdown);

export default router;
