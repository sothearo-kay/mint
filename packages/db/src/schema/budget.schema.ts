import {
  index,
  numeric,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

import { user } from "./auth.schema";
import { budgetPeriodEnum, currencyEnum } from "./enums";
import { category } from "./category.schema";

export const budget = pgTable(
  "budget",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => category.id),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    currency: currencyEnum("currency").notNull(),
    period: budgetPeriodEnum("period").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("budget_userId_idx").on(table.userId),
    unique("budget_userId_categoryId_period_unq").on(
      table.userId,
      table.categoryId,
      table.period,
    ),
  ],
);
