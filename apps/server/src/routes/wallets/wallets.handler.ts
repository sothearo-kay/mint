import type { CreateRoute, ListRoute, ListTransfersRoute, RemoveRoute, ReorderRoute, TransferRoute, UpdateRoute } from "./wallets.routes";
import type { AppRouteHandler } from "@/lib/types";

import { randomUUID } from "node:crypto";
import { db } from "@mint/db";
import { transaction, wallet, walletTransfer } from "@mint/db/schema";
import { and, asc, desc, eq, getTableColumns, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

const fromWallet = alias(wallet, "from_wallet");
const toWallet = alias(wallet, "to_wallet");

function formatWallet(w: typeof wallet.$inferSelect & { balance: string }) {
  return {
    ...w,
    createdAt: w.createdAt.toISOString(),
    updatedAt: w.updatedAt.toISOString(),
  };
}

function formatTransfer(
  t: typeof walletTransfer.$inferSelect,
  from: { id: string; name: string; currency: "USD" | "KHR"; type: "cash" | "bank" | "savings" },
  to: { id: string; name: string; currency: "USD" | "KHR"; type: "cash" | "bank" | "savings" },
) {
  return {
    id: t.id,
    userId: t.userId,
    fromWalletId: t.fromWalletId,
    toWalletId: t.toWalletId,
    fromAmount: t.fromAmount,
    toAmount: t.toAmount,
    note: t.note,
    date: t.date.toISOString(),
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
    fromWallet: from,
    toWallet: to,
  };
}

async function getWalletsWithBalance(userId: string) {
  return db
    .select({
      ...getTableColumns(wallet),
      balance: sql<string>`
        coalesce(sum(case when ${transaction.type} = 'income' then ${transaction.amount} else -${transaction.amount} end), 0)
        + coalesce((select sum(wt.to_amount) from wallet_transfer wt where wt.to_wallet_id = ${wallet.id} and wt.user_id = ${userId}), 0)
        - coalesce((select sum(wt.from_amount) from wallet_transfer wt where wt.from_wallet_id = ${wallet.id} and wt.user_id = ${userId}), 0)
      `,
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

export const transfer: AppRouteHandler<TransferRoute> = async (c) => {
  const user = c.var.user!;
  const body = c.req.valid("json");

  if (body.fromWalletId === body.toWalletId)
    return c.json({ message: "Cannot transfer to the same wallet" }, 400);

  const [from] = await db
    .select()
    .from(wallet)
    .where(and(eq(wallet.id, body.fromWalletId), eq(wallet.userId, user.id)));

  if (!from)
    return c.json({ message: "Source wallet not found" }, 404);

  const [to] = await db
    .select()
    .from(wallet)
    .where(and(eq(wallet.id, body.toWalletId), eq(wallet.userId, user.id)));

  if (!to)
    return c.json({ message: "Destination wallet not found" }, 404);

  const [created] = await db
    .insert(walletTransfer)
    .values({
      id: randomUUID(),
      userId: user.id,
      fromWalletId: body.fromWalletId,
      toWalletId: body.toWalletId,
      fromAmount: body.fromAmount,
      toAmount: body.toAmount,
      note: body.note ?? null,
      date: new Date(body.date),
    })
    .returning();

  return c.json(
    formatTransfer(
      created,
      { id: from.id, name: from.name, currency: from.currency, type: from.type },
      { id: to.id, name: to.name, currency: to.currency, type: to.type },
    ),
    201,
  );
};

export const listTransfers: AppRouteHandler<ListTransfersRoute> = async (c) => {
  const user = c.var.user!;
  const { id } = c.req.valid("param");

  const [w] = await db
    .select()
    .from(wallet)
    .where(and(eq(wallet.id, id), eq(wallet.userId, user.id)));

  if (!w)
    return c.json({ message: "Wallet not found" }, 404);

  const rows = await db
    .select({
      transfer: getTableColumns(walletTransfer),
      fromWallet: {
        id: fromWallet.id,
        name: fromWallet.name,
        currency: fromWallet.currency,
        type: fromWallet.type,
      },
      toWallet: {
        id: toWallet.id,
        name: toWallet.name,
        currency: toWallet.currency,
        type: toWallet.type,
      },
    })
    .from(walletTransfer)
    .innerJoin(fromWallet, eq(walletTransfer.fromWalletId, fromWallet.id))
    .innerJoin(toWallet, eq(walletTransfer.toWalletId, toWallet.id))
    .where(
      and(
        eq(walletTransfer.userId, user.id),
        or(
          eq(walletTransfer.fromWalletId, id),
          eq(walletTransfer.toWalletId, id),
        ),
      ),
    )
    .orderBy(desc(walletTransfer.date));

  return c.json(
    rows.map(r => formatTransfer(r.transfer, r.fromWallet, r.toWallet)),
    200,
  );
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
