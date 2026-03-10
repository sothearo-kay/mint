import type { CreateRoute, ListRoute, RemoveRoute, ReorderRoute, ResetRoute, SummaryRoute } from "./categories.routes";
import type { AppRouteHandler } from "@/lib/types";
import { randomUUID } from "node:crypto";
import { db } from "@mint/db";
import { category, transaction } from "@mint/db/schema";
import { and, asc, eq, gte, isNull, lt, or, sql, sum } from "drizzle-orm";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const user = c.var.user;

  const categories = await db
    .select()
    .from(category)
    .where(
      user
        ? or(isNull(category.userId), eq(category.userId, user.id))
        : isNull(category.userId),
    )
    .orderBy(
      category.type,
      sql`${category.userId} is not null`,
      asc(category.position),
      asc(category.name),
    );

  return c.json(
    categories.map(cat => ({
      ...cat,
      createdAt: cat.createdAt.toISOString(),
    })),
  );
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const user = c.var.user!;
  const body = c.req.valid("json");

  const [created] = await db
    .insert(category)
    .values({
      id: randomUUID(),
      userId: user.id,
      name: body.name,
      icon: body.icon,
      type: body.type,
    })
    .returning();

  return c.json({ ...created, createdAt: created.createdAt.toISOString() }, 201);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const user = c.var.user!;
  const { id } = c.req.valid("param");

  const [existing] = await db.select().from(category).where(eq(category.id, id));

  if (!existing)
    return c.json({ message: "Not found" }, 404);
  if (existing.userId === null)
    return c.json({ message: "Cannot delete a system category" }, 403);
  if (existing.userId !== user.id)
    return c.json({ message: "Forbidden" }, 403);

  await db.delete(category).where(eq(category.id, id));

  return c.body(null, 204);
};

export const reset: AppRouteHandler<ResetRoute> = async (c) => {
  const user = c.var.user!;

  await db.delete(category).where(eq(category.userId, user.id));

  return c.body(null, 204);
};

export const reorder: AppRouteHandler<ReorderRoute> = async (c) => {
  const user = c.var.user!;
  const { order } = c.req.valid("json");

  await Promise.all(
    order.map(({ id, position }) =>
      db
        .update(category)
        .set({ position })
        .where(and(eq(category.id, id), eq(category.userId, user.id))),
    ),
  );

  return c.body(null, 204);
};

export const summary: AppRouteHandler<SummaryRoute> = async (c) => {
  const user = c.var.user!;
  const { from, to, currency } = c.req.valid("query");

  const conditions = [eq(transaction.userId, user.id)];
  if (from)
    conditions.push(gte(transaction.date, new Date(from)));
  if (to)
    conditions.push(lt(transaction.date, new Date(to)));
  if (currency)
    conditions.push(eq(transaction.currency, currency));

  const rows = await db
    .select({
      id: category.id,
      name: category.name,
      icon: category.icon,
      type: transaction.type,
      total: sum(transaction.amount),
    })
    .from(transaction)
    .innerJoin(category, eq(transaction.categoryId, category.id))
    .where(and(...conditions))
    .groupBy(category.id, category.name, category.icon, transaction.type);

  const income = rows
    .filter(r => r.type === "income")
    .reduce((s, r) => s + Number.parseFloat(r.total ?? "0"), 0);

  const expense = rows
    .filter(r => r.type === "expense")
    .reduce((s, r) => s + Number.parseFloat(r.total ?? "0"), 0);

  const categories = rows
    .filter(r => r.type === "expense")
    .map(r => ({ id: r.id, name: r.name, icon: r.icon, amount: r.total ?? "0" }))
    .sort((a, b) => Number.parseFloat(b.amount) - Number.parseFloat(a.amount));

  return c.json({ income: String(income), expense: String(expense), categories }, 200);
};
