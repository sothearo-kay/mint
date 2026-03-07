import type { BreakdownRoute, GetRoute } from "./insights.routes";
import type { AppRouteHandler } from "@/lib/types";
import { db } from "@mint/db";
import { category, transaction } from "@mint/db/schema";
import { and, eq, gte, lt, sql, sum } from "drizzle-orm";

export const get: AppRouteHandler<GetRoute> = async (c) => {
  const user = c.var.user!;
  const { year = new Date().getFullYear(), currency } = c.req.valid("query");

  const from = new Date(year, 0, 1);
  const to = new Date(year + 1, 0, 1);

  const rows = await db
    .select()
    .from(transaction)
    .where(
      and(
        eq(transaction.userId, user.id),
        gte(transaction.date, from),
        lt(transaction.date, to),
        currency ? eq(transaction.currency, currency) : undefined,
      ),
    );

  const monthly = Array.from({ length: 12 }, (_, i) => {
    const monthTxs = rows.filter(tx => tx.date.getMonth() === i);
    const income = monthTxs
      .filter(tx => tx.type === "income")
      .reduce((s, tx) => s + Number.parseFloat(tx.amount), 0);
    const expense = monthTxs
      .filter(tx => tx.type === "expense")
      .reduce((s, tx) => s + Number.parseFloat(tx.amount), 0);
    return { month: i + 1, income, expense, balance: income - expense };
  });

  return c.json({ monthly }, 200);
};

export const breakdown: AppRouteHandler<BreakdownRoute> = async (c) => {
  const user = c.var.user!;
  const { year = new Date().getFullYear(), currency } = c.req.valid("query");

  const from = new Date(year, 0, 1);
  const to = new Date(year + 1, 0, 1);

  const rows = await db
    .select({
      month: sql<number>`extract(month from ${transaction.date})::int`,
      categoryId: category.id,
      categoryName: category.name,
      categoryIcon: category.icon,
      total: sum(transaction.amount),
    })
    .from(transaction)
    .innerJoin(category, eq(transaction.categoryId, category.id))
    .where(
      and(
        eq(transaction.userId, user.id),
        gte(transaction.date, from),
        lt(transaction.date, to),
        eq(transaction.type, "income"),
        currency ? eq(transaction.currency, currency) : undefined,
      ),
    )
    .groupBy(
      sql`extract(month from ${transaction.date})`,
      category.id,
      category.name,
      category.icon,
    );

  const monthly = Array.from({ length: 12 }, (_, i) => {
    const monthNum = i + 1;
    const incomeCategories = rows
      .filter(r => r.month === monthNum)
      .map(r => ({ id: r.categoryId, name: r.categoryName, icon: r.categoryIcon, amount: r.total ?? "0" }))
      .sort((a, b) => Number.parseFloat(b.amount) - Number.parseFloat(a.amount));
    return { month: monthNum, incomeCategories };
  });

  return c.json({ monthly }, 200);
};
