import type { CreateRoute, ListRoute, RemoveRoute, SyncRoute, UpdateRoute } from "./transactions.routes";
import type { AppRouteHandler } from "@/lib/types";
import { Buffer } from "node:buffer";
import { randomUUID } from "node:crypto";
import { db } from "@mint/db";
import { category, recurringTransaction, transaction } from "@mint/db/schema";
import { and, desc, eq, gte, isNull, lt, lte, or, sql } from "drizzle-orm";

function formatTransaction(
  tx: typeof transaction.$inferSelect,
  cat: typeof category.$inferSelect,
  recurring: typeof recurringTransaction.$inferSelect | null = null,
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
    walletId: tx.walletId,
    category: { id: cat.id, name: cat.name, icon: cat.icon, type: cat.type },
    recurring: recurring ? { id: recurring.id, name: recurring.name, logo: recurring.logo } : null,
  };
}

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const user = c.var.user!;
  const { cursor, limit = 20, ...filters } = c.req.valid("query");

  const { type, categoryId, from, to, walletId } = filters;

  const baseWhere = and(
    eq(transaction.userId, user.id),
    type ? eq(transaction.type, type) : undefined,
    categoryId ? eq(transaction.categoryId, categoryId) : undefined,
    from ? gte(transaction.date, new Date(from)) : undefined,
    to ? lte(transaction.date, new Date(to)) : undefined,
    walletId === "none" ? isNull(transaction.walletId) : walletId ? eq(transaction.walletId, walletId) : undefined,
  );

  let cursorWhere;
  if (cursor) {
    const [dateStr, createdAtStr] = Buffer.from(cursor, "base64url").toString().split("|||");
    cursorWhere = or(
      lt(transaction.date, new Date(dateStr)),
      and(eq(transaction.date, new Date(dateStr)), lt(transaction.createdAt, new Date(createdAtStr))),
    );
  }

  const [rows, totalsRows] = await Promise.all([
    db
      .select()
      .from(transaction)
      .innerJoin(category, eq(transaction.categoryId, category.id))
      .leftJoin(recurringTransaction, eq(transaction.recurringId, recurringTransaction.id))
      .where(and(baseWhere, cursorWhere))
      .orderBy(desc(transaction.date), desc(transaction.createdAt))
      .limit(limit + 1),
    db
      .select({
        type: transaction.type,
        currency: transaction.currency,
        total: sql<string>`CAST(SUM(CAST(${transaction.amount} AS NUMERIC)) AS TEXT)`,
      })
      .from(transaction)
      .where(baseWhere)
      .groupBy(transaction.type, transaction.currency),
  ]);

  const hasNextPage = rows.length > limit;
  const data = hasNextPage ? rows.slice(0, limit) : rows;
  const last = data.at(-1);

  const totals = { income: { USD: "0", KHR: "0" }, expense: { USD: "0", KHR: "0" } };
  for (const { type: t, currency: cur, total } of totalsRows) {
    totals[t as "income" | "expense"][cur as "USD" | "KHR"] = total ?? "0";
  }

  const nextCursor = hasNextPage && last
    ? Buffer.from(`${last.transaction.date.toISOString()}|||${last.transaction.createdAt.toISOString()}`).toString("base64url")
    : null;

  return c.json({
    data: data.map(r => formatTransaction(r.transaction, r.category, r.recurring_transaction)),
    nextCursor,
    totals,
  }, 200);
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
      walletId: body.walletId ?? null,
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
      ...(body.walletId !== undefined && { walletId: body.walletId }),
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
