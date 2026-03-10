import { createRouter } from "@/lib/create-app";

import * as handlers from "./recurring.handler";
import * as routes from "./recurring.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.update, handlers.update)
  .openapi(routes.remove, handlers.remove);

export default router;
