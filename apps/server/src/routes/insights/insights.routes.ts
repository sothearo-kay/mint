import { createRoute, z } from "@hono/zod-openapi";
import { errorSchema } from "@/lib/schemas";
import { authMiddleware } from "@/middlewares";

const tags = ["Insights"];

const monthlyInsightSchema = z.object({
  month: z.number().int().min(1).max(12),
  income: z.number(),
  expense: z.number(),
  balance: z.number(),
});

const insightsSchema = z.object({
  monthly: z.array(monthlyInsightSchema),
});

export const get = createRoute({
  operationId: "getInsights",
  path: "/insights",
  method: "get",
  middleware: [authMiddleware],
  tags,
  request: {
    query: z.object({
      year: z.coerce.number().int().optional(),
    }),
  },
  responses: {
    200: {
      content: { "application/json": { schema: insightsSchema } },
      description: "Monthly insights for the given year",
    },
    401: {
      content: { "application/json": { schema: errorSchema } },
      description: "Unauthorized",
    },
  },
});

export type GetRoute = typeof get;

const incomeCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  amount: z.string(),
});

const monthlyBreakdownSchema = z.object({
  month: z.number().int().min(1).max(12),
  incomeCategories: z.array(incomeCategorySchema),
});

const breakdownSchema = z.object({
  monthly: z.array(monthlyBreakdownSchema),
});

export const getBreakdown = createRoute({
  operationId: "getInsightsBreakdown",
  path: "/insights/breakdown",
  method: "get",
  middleware: [authMiddleware],
  tags,
  request: {
    query: z.object({
      year: z.coerce.number().int().optional(),
    }),
  },
  responses: {
    200: {
      content: { "application/json": { schema: breakdownSchema } },
      description: "Monthly income category breakdown for the given year",
    },
    401: {
      content: { "application/json": { schema: errorSchema } },
      description: "Unauthorized",
    },
  },
});

export type BreakdownRoute = typeof getBreakdown;
