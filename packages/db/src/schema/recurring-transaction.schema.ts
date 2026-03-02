import {
  boolean,
  index,
  numeric,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { user } from "./auth.schema";
import { currencyEnum, frequencyEnum, transactionTypeEnum } from "./enums";
import { category } from "./category.schema";

export const recurringTransaction = pgTable(
  "recurring_transaction",
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
    note: text("note"),
    frequency: frequencyEnum("frequency").notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
    nextScheduledDate: timestamp("next_scheduled_date").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("recurring_transaction_userId_idx").on(table.userId),
    index("recurring_transaction_nextScheduledDate_idx").on(
      table.nextScheduledDate,
    ),
  ],
);
