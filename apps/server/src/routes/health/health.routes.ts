import { createRoute, z } from "@hono/zod-openapi";

const tags = ["Health"];

export const check = createRoute({
  operationId: "healthCheck",
  path: "/health",
  method: "get",
  tags,
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            status: z.string().openapi({ example: "ok" }),
            timestamp: z
              .string()
              .openapi({ example: "2024-01-01T00:00:00.000Z" }),
          }),
        },
      },
      description: "Health check response",
    },
  },
});

export type CheckRoute = typeof check;
