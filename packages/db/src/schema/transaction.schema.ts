import { index, numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth.schema";
import { currencyEnum, transactionTypeEnum } from "./enums";
import { category } from "./category.schema";
import { recurringTransaction } from "./recurring-transaction.schema";

export const transaction = pgTable(
  "transaction",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: transactionTypeEnum("type").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    currency: currencyEnum("currency").notNull(),
    categoryId: text("category_id")
      .notNull()
      .references(() => category.id),
    recurringId: text("recurring_id").references(
      () => recurringTransaction.id,
      { onDelete: "set null" },
    ),
    note: text("note"),
    date: timestamp("date").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("transaction_userId_idx").on(table.userId),
    index("transaction_categoryId_idx").on(table.categoryId),
    index("transaction_date_idx").on(table.date),
  ],
);
