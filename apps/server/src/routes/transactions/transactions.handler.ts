import type { CreateRoute, ListRoute, RemoveRoute, SyncRoute, UpdateRoute } from "./transactions.routes";
import type { AppRouteHandler } from "@/lib/types";
import { randomUUID } from "node:crypto";
import { db } from "@mint/db";
import { category, transaction } from "@mint/db/schema";
import { and, desc, eq, gte, lte } from "drizzle-orm";

function formatTransaction(
  tx: typeof transaction.$inferSelect,
  cat: typeof category.$inferSelect,
) {
  return {
    id: tx.id,
    type: tx.type,
    amount: tx.amount,
    currency: tx.currency,
    note: tx.note,
    date: tx.date.toISOString(),
    createdAt: tx.createdAt.toISOString(),
    updatedAt: tx.updatedAt.toISOString(),
    category: {
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      type: cat.type,
    },
  };
}

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const user = c.var.user!;
  const { type, categoryId, from, to } = c.req.valid("query");

  const rows = await db
    .select()
    .from(transaction)
    .innerJoin(category, eq(transaction.categoryId, category.id))
    .where(
      and(
        eq(transaction.userId, user.id),
        type ? eq(transaction.type, type) : undefined,
        categoryId ? eq(transaction.categoryId, categoryId) : undefined,
        from ? gte(transaction.date, new Date(from)) : undefined,
        to ? lte(transaction.date, new Date(to)) : undefined,
      ),
    )
    .orderBy(desc(transaction.date));

  return c.json(rows.map(r => formatTransaction(r.transaction, r.category)), 200);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const user = c.var.user!;
  const body = c.req.valid("json");

  const [created] = await db
    .insert(transaction)
    .values({
      id: body.id ?? randomUUID(),
      userId: user.id,
      type: body.type,
      amount: body.amount,
      currency: body.currency,
      categoryId: body.categoryId,
      note: body.note ?? null,
      date: new Date(body.date),
    })
    .returning();

  const [cat] = await db.select().from(category).where(eq(category.id, created.categoryId));

  return c.json(formatTransaction(created, cat), 201);
};

export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const user = c.var.user!;
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");

  const [existing] = await db.select().from(transaction).where(eq(transaction.id, id));
  if (!existing)
    return c.json({ message: "Not found" }, 404);
  if (existing.userId !== user.id)
    return c.json({ message: "Forbidden" }, 403);

  const [updated] = await db
    .update(transaction)
    .set({
      ...(body.type && { type: body.type }),
      ...(body.amount && { amount: body.amount }),
      ...(body.currency && { currency: body.currency }),
      ...(body.categoryId && { categoryId: body.categoryId }),
      ...(body.note !== undefined && { note: body.note }),
      ...(body.date && { date: new Date(body.date) }),
    })
    .where(eq(transaction.id, id))
    .returning();

  const [cat] = await db.select().from(category).where(eq(category.id, updated.categoryId));

  return c.json(formatTransaction(updated, cat), 200);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const user = c.var.user!;
  const { id } = c.req.valid("param");

  const [existing] = await db.select().from(transaction).where(eq(transaction.id, id));
  if (!existing)
    return c.json({ message: "Not found" }, 404);
  if (existing.userId !== user.id)
    return c.json({ message: "Forbidden" }, 403);

  await db.delete(transaction).where(eq(transaction.id, id));

  return c.body(null, 204);
};

export const sync: AppRouteHandler<SyncRoute> = async (c) => {
  const user = c.var.user!;
  const body = c.req.valid("json");

  if (body.length === 0)
    return c.body(null, 204);

  await db
    .insert(transaction)
    .values(
      body.map(tx => ({
        id: tx.id ?? randomUUID(),
        userId: user.id,
        type: tx.type,
        amount: tx.amount,
        currency: tx.currency,
        categoryId: tx.categoryId,
        note: tx.note ?? null,
        date: new Date(tx.date),
      })),
    )
    .onConflictDoNothing();

  return c.body(null, 204);
};
