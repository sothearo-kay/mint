import { index, numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth.schema";
import { wallet } from "./wallet.schema";

export const walletTransfer = pgTable(
  "wallet_transfer",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    fromWalletId: text("from_wallet_id")
      .notNull()
      .references(() => wallet.id, { onDelete: "cascade" }),
    toWalletId: text("to_wallet_id")
      .notNull()
      .references(() => wallet.id, { onDelete: "cascade" }),
    fromAmount: numeric("from_amount", { precision: 12, scale: 2 }).notNull(),
    toAmount: numeric("to_amount", { precision: 12, scale: 2 }).notNull(),
    note: text("note"),
    date: timestamp("date").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("wallet_transfer_userId_idx").on(table.userId),
    index("wallet_transfer_fromWalletId_idx").on(table.fromWalletId),
    index("wallet_transfer_toWalletId_idx").on(table.toWalletId),
  ],
);
