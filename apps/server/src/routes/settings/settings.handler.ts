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
  return c.json({ budgetLimit: row?.budgetLimit ?? null }, 200);
};

export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const user = c.var.user!;
  const { budgetLimit } = c.req.valid("json");

  const [row] = await db
    .insert(settings)
    .values({ userId: user.id, budgetLimit })
    .onConflictDoUpdate({
      target: settings.userId,
      set: { budgetLimit },
    })
    .returning();

  return c.json({ budgetLimit: row.budgetLimit ?? null }, 200);
};
