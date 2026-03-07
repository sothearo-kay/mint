import { createRouter } from "@/lib/create-app";

import * as handlers from "./wallets.handler";
import * as routes from "./wallets.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.reorder, handlers.reorder)
  .openapi(routes.update, handlers.update)
  .openapi(routes.remove, handlers.remove);

export default router;
