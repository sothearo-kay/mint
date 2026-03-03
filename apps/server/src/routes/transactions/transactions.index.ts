import { createRouter } from "@/lib/create-app";

import * as handlers from "./transactions.handler";
import * as routes from "./transactions.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.sync, handlers.sync)
  .openapi(routes.update, handlers.update)
  .openapi(routes.remove, handlers.remove);

export default router;
