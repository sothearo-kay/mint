import { z } from "@hono/zod-openapi";

export const errorSchema = z.object({ message: z.string() });
export const paramsSchema = z.object({ id: z.string() });
