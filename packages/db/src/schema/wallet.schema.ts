import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth.schema";
import { currencyEnum, walletTypeEnum } from "./enums";

export const wallet = pgTable(
  "wallet",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    currency: currencyEnum("currency").notNull(),
    type: walletTypeEnum("type").notNull().default("cash"),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("wallet_userId_idx").on(table.userId),
  ],
);
