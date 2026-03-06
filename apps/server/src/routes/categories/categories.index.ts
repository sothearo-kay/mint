import { createRouter } from "@/lib/create-app";

import * as handlers from "./categories.handler";
import * as routes from "./categories.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.summary, handlers.summary)
  .openapi(routes.create, handlers.create)
  .openapi(routes.reset, handlers.reset)
  .openapi(routes.remove, handlers.remove);

export default router;
