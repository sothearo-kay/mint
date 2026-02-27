import { createRouter } from "@/lib/create-app";

import * as handlers from "./health.handler";
import * as routes from "./health.routes";

const router = createRouter().openapi(routes.check, handlers.check);

export default router;
