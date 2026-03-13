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

const walletSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  currency: z.enum(["USD", "KHR"]),
  type: z.enum(["cash", "bank", "savings"]),
});

export const walletTransferSchema = z.object({
  id: z.string(),
  userId: z.string(),
  fromWalletId: z.string(),
  toWalletId: z.string(),
  fromAmount: z.string(),
  toAmount: z.string(),
  note: z.string().nullable(),
  date: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  fromWallet: walletSummarySchema,
  toWallet: walletSummarySchema,
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

export const transfer = createRoute({
  operationId: "transferWallet",
  path: "/wallets/transfer",
  method: "post",
  middleware: [authMiddleware],
  tags,
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            fromWalletId: z.string(),
            toWalletId: z.string(),
            fromAmount: z.string(),
            toAmount: z.string(),
            note: z.string().optional(),
            date: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      content: { "application/json": { schema: walletTransferSchema } },
      description: "Created transfer",
    },
    400: {
      content: { "application/json": { schema: errorSchema } },
      description: "Bad request",
    },
    401: {
      content: { "application/json": { schema: errorSchema } },
      description: "Unauthorized",
    },
    404: {
      content: { "application/json": { schema: errorSchema } },
      description: "Wallet not found",
    },
  },
});

export const listTransfers = createRoute({
  operationId: "listWalletTransfers",
  path: "/wallets/{id}/transfers",
  method: "get",
  middleware: [authMiddleware],
  tags,
  request: { params: paramsSchema },
  responses: {
    200: {
      content: { "application/json": { schema: z.array(walletTransferSchema) } },
      description: "List of transfers for this wallet",
    },
    401: {
      content: { "application/json": { schema: errorSchema } },
      description: "Unauthorized",
    },
    404: {
      content: { "application/json": { schema: errorSchema } },
      description: "Wallet not found",
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
export type TransferRoute = typeof transfer;
export type ListTransfersRoute = typeof listTransfers;
export type UpdateRoute = typeof update;
export type ReorderRoute = typeof reorder;
export type RemoveRoute = typeof remove;
