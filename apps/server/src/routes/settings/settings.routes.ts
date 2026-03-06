import { createRoute, z } from "@hono/zod-openapi";
import { errorSchema } from "@/lib/schemas";
import { authMiddleware } from "@/middlewares";

const tags = ["Settings"];

const settingsSchema = z.object({
  budgetLimit: z.string().nullable(),
});

export const get = createRoute({
  operationId: "getSettings",
  path: "/settings",
  method: "get",
  middleware: [authMiddleware],
  tags,
  responses: {
    200: {
      content: { "application/json": { schema: settingsSchema } },
      description: "User settings",
    },
    401: {
      content: { "application/json": { schema: errorSchema } },
      description: "Unauthorized",
    },
  },
});

export const update = createRoute({
  operationId: "updateSettings",
  path: "/settings",
  method: "put",
  middleware: [authMiddleware],
  tags,
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            budgetLimit: z.string().regex(/^\d+(\.\d{1,2})?$/).nullable(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: settingsSchema } },
      description: "Updated settings",
    },
    401: {
      content: { "application/json": { schema: errorSchema } },
      description: "Unauthorized",
    },
  },
});

export type GetRoute = typeof get;
export type UpdateRoute = typeof update;
