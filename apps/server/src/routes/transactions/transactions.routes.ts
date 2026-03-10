import { createRoute, z } from "@hono/zod-openapi";
import { errorSchema, paramsSchema } from "@/lib/schemas";
import { authMiddleware } from "@/middlewares";

const tags = ["Transactions"];

const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  type: z.enum(["income", "expense"]),
});

const transactionSchema = z.object({
  id: z.string(),
  type: z.enum(["income", "expense"]),
  amount: z.string(),
  currency: z.enum(["USD", "KHR"]),
  category: categorySchema,
  note: z.string().nullable(),
  date: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  walletId: z.string().nullable(),
  recurring: z.object({
    id: z.string(),
    name: z.string(),
    logo: z.string().nullable(),
  }).nullable(),
});

const transactionBodySchema = z.object({
  id: z.string().optional(),
  type: z.enum(["income", "expense"]),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  currency: z.enum(["USD", "KHR"]),
  categoryId: z.string(),
  note: z.string().nullable().optional(),
  date: z.iso.datetime(),
  walletId: z.string().nullable().optional(),
});

export const list = createRoute({
  operationId: "listTransactions",
  path: "/transactions",
  method: "get",
  middleware: [authMiddleware],
  tags,
  request: {
    query: z.object({
      type: z.enum(["income", "expense"]).optional(),
      categoryId: z.string().optional(),
      from: z.iso.datetime().optional(),
      to: z.iso.datetime().optional(),
      walletId: z.string().optional(),
    }),
  },
  responses: {
    200: {
      content: { "application/json": { schema: z.array(transactionSchema) } },
      description: "List of transactions",
    },
    401: {
      content: { "application/json": { schema: errorSchema } },
      description: "Unauthorized",
    },
  },
});

export const create = createRoute({
  operationId: "createTransaction",
  path: "/transactions",
  method: "post",
  middleware: [authMiddleware],
  tags,
  request: {
    body: {
      content: { "application/json": { schema: transactionBodySchema } },
    },
  },
  responses: {
    201: {
      content: { "application/json": { schema: transactionSchema } },
      description: "Created transaction",
    },
    401: {
      content: { "application/json": { schema: errorSchema } },
      description: "Unauthorized",
    },
  },
});

export const update = createRoute({
  operationId: "updateTransaction",
  path: "/transactions/:id",
  method: "patch",
  middleware: [authMiddleware],
  tags,
  request: {
    params: paramsSchema,
    body: {
      content: { "application/json": { schema: transactionBodySchema.partial() } },
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: transactionSchema } },
      description: "Updated transaction",
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
  operationId: "deleteTransaction",
  path: "/transactions/:id",
  method: "delete",
  middleware: [authMiddleware],
  tags,
  request: { params: paramsSchema },
  responses: {
    204: { description: "Deleted" },
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

export const sync = createRoute({
  operationId: "syncTransactions",
  path: "/transactions/sync",
  method: "post",
  middleware: [authMiddleware],
  tags,
  request: {
    body: {
      content: {
        "application/json": { schema: z.array(transactionBodySchema) },
      },
    },
  },
  responses: {
    204: { description: "Synced" },
    401: {
      content: { "application/json": { schema: errorSchema } },
      description: "Unauthorized",
    },
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
export type SyncRoute = typeof sync;
