import type { AppRouteHandler } from "@/lib/types";

import type { CheckRoute } from "./health.routes";

export const check: AppRouteHandler<CheckRoute> = (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
};
