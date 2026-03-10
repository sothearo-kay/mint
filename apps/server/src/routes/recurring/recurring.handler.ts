import type { CreateRoute, ListRoute, RemoveRoute, UpdateRoute } from "./recurring.routes";
import type { AppRouteHandler } from "@/lib/types";

import { randomUUID } from "node:crypto";
import { db } from "@mint/db";
import { category, recurringTransaction, transaction } from "@mint/db/schema";
import { and, eq, lte } from "drizzle-orm";

function formatRecurring(
  r: typeof recurringTransaction.$inferSelect,
  cat: typeof category.$inferSelect,
) {
  return {
    ...r,
    startDate: r.startDate.toISOString(),
    endDate: r.endDate?.toISOString() ?? null,
    nextScheduledDate: r.nextScheduledDate.toISOString(),
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    category: {
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
    },
  };
}

function advanceDate(date: Date, frequency: typeof recurringTransaction.$inferSelect["frequency"]): Date {
  const next = new Date(date);
  switch (frequency) {
    case "daily": next.setDate(next.getDate() + 1);
      break;
    case "weekly": next.setDate(next.getDate() + 7);
      break;
    case "monthly": next.setMonth(next.getMonth() + 1);
      break;
    case "yearly": next.setFullYear(next.getFullYear() + 1);
      break;
  }
  return next;
}

async function processOverdue(userId: string) {
  const now = new Date();

  const overdue = await db
    .select()
    .from(recurringTransaction)
    .where(
      and(
        eq(recurringTransaction.userId, userId),
        eq(recurringTransaction.isActive, true),
        lte(recurringTransaction.nextScheduledDate, now),
      ),
    );

  if (overdue.length === 0)
    return;

  await Promise.all(
    overdue.map(async (rule) => {
      let nextDate = new Date(rule.nextScheduledDate);

      // Create a transaction for each missed cycle
      while (nextDate <= now) {
        await db.insert(transaction).values({
          id: randomUUID(),
          userId: rule.userId,
          walletId: rule.walletId ?? null,
          categoryId: rule.categoryId,
          type: rule.type,
          amount: rule.amount,
          currency: rule.currency,
          note: rule.note ?? null,
          recurringId: rule.id,
          date: nextDate,
        });

        nextDate = advanceDate(nextDate, rule.frequency);
      }

      const isExpired = rule.endDate && nextDate > rule.endDate;

      await db
        .update(recurringTransaction)
        .set({
          nextScheduledDate: nextDate,
          ...(isExpired && { isActive: false }),
        })
        .where(eq(recurringTransaction.id, rule.id));
    }),
  );
}

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const user = c.var.user!;

  await processOverdue(user.id);

  const rows = await db
    .select()
    .from(recurringTransaction)
    .innerJoin(category, eq(recurringTransaction.categoryId, category.id))
    .where(eq(recurringTransaction.userId, user.id));

  return c.json(rows.map(r => formatRecurring(r.recurring_transaction, r.category)), 200);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const user = c.var.user!;
  const body = c.req.valid("json");

  const startDate = new Date(body.startDate);

  const [created] = await db
    .insert(recurringTransaction)
    .values({
      id: randomUUID(),
      userId: user.id,
      walletId: body.walletId ?? null,
      categoryId: body.categoryId,
      name: body.name,
      amount: body.amount,
      type: body.type,
      currency: body.currency,
      logo: body.logo ?? null,
      note: body.note ?? null,
      frequency: body.frequency,
      startDate,
      endDate: body.endDate ? new Date(body.endDate) : null,
      nextScheduledDate: startDate,
      isActive: body.isActive,
    })
    .returning();

  const [cat] = await db.select().from(category).where(eq(category.id, created.categoryId));

  return c.json(formatRecurring(created, cat), 201);
};

export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const user = c.var.user!;
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");

  const [existing] = await db
    .select()
    .from(recurringTransaction)
    .where(eq(recurringTransaction.id, id));

  if (!existing)
    return c.json({ message: "Not found" }, 404);
  if (existing.userId !== user.id)
    return c.json({ message: "Forbidden" }, 403);

  const { startDate, endDate, ...rest } = body;
  const updateData: Partial<typeof recurringTransaction.$inferInsert> = {
    ...rest,
    ...(startDate && { startDate: new Date(startDate) }),
    ...(endDate && { endDate: new Date(endDate) }),
  };

  const [updated] = await db
    .update(recurringTransaction)
    .set(updateData)
    .where(eq(recurringTransaction.id, id))
    .returning();

  const [cat] = await db.select().from(category).where(eq(category.id, updated.categoryId));

  return c.json(formatRecurring(updated, cat), 200);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const user = c.var.user!;
  const { id } = c.req.valid("param");

  const [existing] = await db
    .select()
    .from(recurringTransaction)
    .where(eq(recurringTransaction.id, id));

  if (!existing)
    return c.json({ message: "Not found" }, 404);
  if (existing.userId !== user.id)
    return c.json({ message: "Forbidden" }, 403);

  await db.delete(recurringTransaction).where(eq(recurringTransaction.id, id));

  return c.body(null, 204);
};
