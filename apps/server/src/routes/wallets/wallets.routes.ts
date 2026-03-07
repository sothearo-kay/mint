import { createRoute, z } from "@hono/zod-openapi";

import { errorSchema, paramsSchema } from "@/lib/schemas";
import { authMiddleware } from "@/middlewares";

const tags = ["Wallets"];

export const walletSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  currency: z.enum(["USD", "KHR"]),
  type: z.enum(["cash", "bank", "savings"]),
  position: z.number(),
  balance: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const list = createRoute({
  operationId: "listWallets",
  path: "/wallets",
  method: "get",
  middleware: [authMiddleware],
  tags,
  responses: {
    200: {
      content: { "application/json": { schema: z.array(walletSchema) } },
      description: "List of user wallets with balance",
    },
    401: {
      content: { "application/json": { schema: errorSchema } },
      description: "Unauthorized",
    },
  },
});

export const create = createRoute({
  operationId: "createWallet",
  path: "/wallets",
  method: "post",
  middleware: [authMiddleware],
  tags,
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            name: z.string().min(1).max(50),
            currency: z.enum(["USD", "KHR"]),
            type: z.enum(["cash", "bank", "savings"]).default("cash"),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      content: { "application/json": { schema: walletSchema } },
      description: "Created wallet",
    },
    401: {
      content: { "application/json": { schema: errorSchema } },
      description: "Unauthorized",
    },
  },
});

export const update = createRoute({
  operationId: "updateWallet",
  path: "/wallets/{id}",
  method: "patch",
  middleware: [authMiddleware],
  tags,
  request: {
    params: paramsSchema,
    body: {
      content: {
        "application/json": {
          schema: z.object({
            name: z.string().min(1).max(50).optional(),
            type: z.enum(["cash", "bank", "savings"]).optional(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: walletSchema } },
      description: "Updated wallet",
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

export const reorder = createRoute({
  operationId: "reorderWallets",
  path: "/wallets/reorder",
  method: "patch",
  middleware: [authMiddleware],
  tags,
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            order: z.array(z.object({ id: z.string(), position: z.number() })),
          }),
        },
      },
    },
  },
  responses: {
    204: { description: "Reordered successfully" },
    401: {
      content: { "application/json": { schema: errorSchema } },
      description: "Unauthorized",
    },
  },
});

export const remove = createRoute({
  operationId: "deleteWallet",
  path: "/wallets/{id}",
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
export type ReorderRoute = typeof reorder;
export type RemoveRoute = typeof remove;
