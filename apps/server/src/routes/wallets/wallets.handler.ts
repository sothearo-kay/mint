import type { CreateRoute, ListRoute, RemoveRoute, ReorderRoute, UpdateRoute } from "./wallets.routes";
import type { AppRouteHandler } from "@/lib/types";

import { randomUUID } from "node:crypto";
import { db } from "@mint/db";
import { transaction, wallet } from "@mint/db/schema";
import { and, asc, eq, getTableColumns, sql } from "drizzle-orm";

function formatWallet(w: typeof wallet.$inferSelect & { balance: string }) {
  return {
    ...w,
    createdAt: w.createdAt.toISOString(),
    updatedAt: w.updatedAt.toISOString(),
  };
}

async function getWalletsWithBalance(userId: string) {
  return db
    .select({
      ...getTableColumns(wallet),
      balance: sql<string>`coalesce(sum(case when ${transaction.type} = 'income' then ${transaction.amount} else -${transaction.amount} end), 0)`,
    })
    .from(wallet)
    .leftJoin(transaction, eq(transaction.walletId, wallet.id))
    .where(eq(wallet.userId, userId))
    .groupBy(wallet.id)
    .orderBy(asc(wallet.position));
}

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const user = c.var.user!;
  const wallets = await getWalletsWithBalance(user.id);
  return c.json(wallets.map(formatWallet), 200);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const user = c.var.user!;
  const body = c.req.valid("json");

  const existing = await db
    .select({ position: wallet.position })
    .from(wallet)
    .where(eq(wallet.userId, user.id))
    .orderBy(sql`${wallet.position} desc`)
    .limit(1);

  const nextPosition = existing.length > 0 ? existing[0].position + 1 : 0;

  const [created] = await db
    .insert(wallet)
    .values({
      id: randomUUID(),
      userId: user.id,
      name: body.name,
      currency: body.currency,
      type: body.type,
      position: nextPosition,
    })
    .returning();

  return c.json(formatWallet({ ...created, balance: "0" }), 201);
};

export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const user = c.var.user!;
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");

  const [existing] = await db.select().from(wallet).where(eq(wallet.id, id));

  if (!existing)
    return c.json({ message: "Not found" }, 404);
  if (existing.userId !== user.id)
    return c.json({ message: "Forbidden" }, 403);

  await db.update(wallet).set(body).where(eq(wallet.id, id));

  const [updated] = await getWalletsWithBalance(user.id).then(ws =>
    ws.filter(w => w.id === id),
  );

  return c.json(formatWallet(updated), 200);
};

export const reorder: AppRouteHandler<ReorderRoute> = async (c) => {
  const user = c.var.user!;
  const { order } = c.req.valid("json");

  await Promise.all(
    order.map(({ id, position }) =>
      db
        .update(wallet)
        .set({ position })
        .where(and(eq(wallet.id, id), eq(wallet.userId, user.id))),
    ),
  );

  return c.body(null, 204);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const user = c.var.user!;
  const { id } = c.req.valid("param");

  const [existing] = await db.select().from(wallet).where(eq(wallet.id, id));

  if (!existing)
    return c.json({ message: "Not found" }, 404);
  if (existing.userId !== user.id)
    return c.json({ message: "Forbidden" }, 403);

  await db.delete(wallet).where(eq(wallet.id, id));

  return c.body(null, 204);
};
