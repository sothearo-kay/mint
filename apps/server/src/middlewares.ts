import type { AppBindings } from "@/lib/types";
import { createMiddleware } from "hono/factory";

export const authMiddleware = createMiddleware<AppBindings>(async (c, next) => {
  if (!c.var.user)
    return c.json({ message: "Unauthorized" }, 401);
  await next();
});
