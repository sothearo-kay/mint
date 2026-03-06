import { createRouter } from "@/lib/create-app";
import * as handlers from "./settings.handler";
import * as routes from "./settings.routes";

const router = createRouter()
  .openapi(routes.get, handlers.get)
  .openapi(routes.update, handlers.update);

export default router;
