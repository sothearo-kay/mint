import { createRoute, z } from "@hono/zod-openapi";

import { errorSchema, paramsSchema } from "@/lib/schemas";
import { authMiddleware } from "@/middlewares";

const tags = ["Recurring"];

export const recurringSchema = z.object({
  id: z.string(),
  userId: z.string(),
  walletId: z.string().nullable(),
  categoryId: z.string(),
  name: z.string(),
  amount: z.string(),
  type: z.enum(["income", "expense"]),
  currency: z.enum(["USD", "KHR"]),
  logo: z.string().nullable(),
  note: z.string().nullable(),
  frequency: z.enum(["daily", "weekly", "monthly", "yearly"]),
  startDate: z.string(),
  endDate: z.string().nullable(),
  nextScheduledDate: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  category: z.object({
    id: z.string(),
    name: z.string(),
    icon: z.string(),
  }),
});

const bodySchema = z.object({
  name: z.string().min(1).max(100),
  amount: z.string(),
  type: z.enum(["income", "expense"]),
  currency: z.enum(["USD", "KHR"]),
  categoryId: z.string(),
  walletId: z.string().nullable().optional(),
  logo: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  frequency: z.enum(["daily", "weekly", "monthly", "yearly"]),
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
});

export const list = createRoute({
  operationId: "listRecurring",
  path: "/recurring",
  method: "get",
  middleware: [authMiddleware],
  tags,
  responses: {
    200: {
      content: { "application/json": { schema: z.array(recurringSchema) } },
      description: "List of recurring transactions (with lazy processing applied)",
    },
    401: {
      content: { "application/json": { schema: errorSchema } },
      description: "Unauthorized",
    },
  },
});

export const create = createRoute({
  operationId: "createRecurring",
  path: "/recurring",
  method: "post",
  middleware: [authMiddleware],
  tags,
  request: {
    body: { content: { "application/json": { schema: bodySchema } } },
  },
  responses: {
    201: {
      content: { "application/json": { schema: recurringSchema } },
      description: "Created recurring transaction rule",
    },
    401: {
      content: { "application/json": { schema: errorSchema } },
      description: "Unauthorized",
    },
  },
});

export const update = createRoute({
  operationId: "updateRecurring",
  path: "/recurring/{id}",
  method: "patch",
  middleware: [authMiddleware],
  tags,
  request: {
    params: paramsSchema,
    body: {
      content: {
        "application/json": { schema: bodySchema.partial() },
      },
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: recurringSchema } },
      description: "Updated recurring transaction rule",
    },
    401: {
      content: { "application/json": { schema: errorSchema } },
      description: "Unauthorized",
    },
    403: {
      content: { "application/json": { schema: errorSchema } },
      description: "Forbidden",
    },
    404: {
      content: { "application/json": { schema: errorSchema } },
      description: "Not found",
    },
  },
});

export const remove = createRoute({
  operationId: "deleteRecurring",
  path: "/recurring/{id}",
  method: "delete",
  middleware: [authMiddleware],
  tags,
  request: { params: paramsSchema },
  responses: {
    204: { description: "Deleted successfully" },
    401: {
      content: { "application/json": { schema: errorSchema } },
      description: "Unauthorized",
    },
    403: {
      content: { "application/json": { schema: errorSchema } },
      description: "Forbidden",
    },
    404: {
      content: { "application/json": { schema: errorSchema } },
      description: "Not found",
    },
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
