import { createRoute, z } from "@hono/zod-openapi";
import { errorSchema, paramsSchema } from "@/lib/schemas";
import { authMiddleware } from "@/middlewares";

const tags = ["Categories"];

const categorySchema = z.object({
  id: z.string(),
  userId: z.string().nullable(),
  name: z.string(),
  icon: z.string(),
  type: z.enum(["income", "expense"]),
  createdAt: z.string(),
});

export const list = createRoute({
  operationId: "listCategories",
  path: "/categories",
  method: "get",
  tags,
  responses: {
    200: {
      content: { "application/json": { schema: z.array(categorySchema) } },
      description: "List of system and user categories",
    },
  },
});

export const create = createRoute({
  operationId: "createCategory",
  path: "/categories",
  method: "post",
  middleware: [authMiddleware],
  tags,
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            name: z.string().min(1).max(50),
            icon: z.string().min(1),
            type: z.enum(["income", "expense"]),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      content: { "application/json": { schema: categorySchema } },
      description: "Created category",
    },
    401: {
      content: { "application/json": { schema: errorSchema } },
      description: "Unauthorized",
    },
  },
});

export const remove = createRoute({
  operationId: "deleteCategory",
  path: "/categories/{id}",
  method: "delete",
  middleware: [authMiddleware],
  tags,
  request: {
    params: paramsSchema,
  },
  responses: {
    204: { description: "Deleted" },
    401: {
      content: { "application/json": { schema: errorSchema } },
      description: "Unauthorized",
    },
    403: {
      content: { "application/json": { schema: errorSchema } },
      description: "Cannot delete system or another user's category",
    },
    404: {
      content: { "application/json": { schema: errorSchema } },
      description: "Not found",
    },
  },
});

export const reset = createRoute({
  operationId: "resetCategories",
  path: "/categories/reset",
  method: "post",
  middleware: [authMiddleware],
  tags,
  responses: {
    204: { description: "Reset to system defaults" },
    401: {
      content: { "application/json": { schema: errorSchema } },
      description: "Unauthorized",
    },
  },
});

export const summary = createRoute({
  operationId: "categoriesSummary",
  path: "/categories/summary",
  method: "get",
  middleware: [authMiddleware],
  tags,
  request: {
    query: z.object({
      from: z.iso.datetime().optional(),
      to: z.iso.datetime().optional(),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            income: z.string(),
            expense: z.string(),
            categories: z.array(z.object({
              id: z.string(),
              name: z.string(),
              icon: z.string(),
              amount: z.string(),
            })),
          }),
        },
      },
      description: "Budget summary with income, expense and per-category breakdown",
    },
    401: {
      content: { "application/json": { schema: errorSchema } },
      description: "Unauthorized",
    },
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type RemoveRoute = typeof remove;
export type ResetRoute = typeof reset;
export type SummaryRoute = typeof summary;
