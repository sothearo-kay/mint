import type { GetRoute, UpdateRoute } from "./settings.routes";
import type { AppRouteHandler } from "@/lib/types";
import { db } from "@mint/db";
import { settings } from "@mint/db/schema";
import { eq } from "drizzle-orm";

export const get: AppRouteHandler<GetRoute> = async (c) => {
  const user = c.var.user!;
  const row = await db.query.settings.findFirst({
    where: eq(settings.userId, user.id),
  });
  return c.json({
    budgetLimitUSD: row?.budgetLimitUSD ?? null,
    budgetLimitKHR: row?.budgetLimitKHR ?? null,
  }, 200);
};

export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const user = c.var.user!;
  const { budgetLimitUSD, budgetLimitKHR } = c.req.valid("json");

  const [row] = await db
    .insert(settings)
    .values({ userId: user.id, budgetLimitUSD, budgetLimitKHR })
    .onConflictDoUpdate({
      target: settings.userId,
      set: {
        ...(budgetLimitUSD !== undefined && { budgetLimitUSD }),
        ...(budgetLimitKHR !== undefined && { budgetLimitKHR }),
      },
    })
    .returning();

  return c.json({
    budgetLimitUSD: row.budgetLimitUSD ?? null,
    budgetLimitKHR: row.budgetLimitKHR ?? null,
  }, 200);
};
