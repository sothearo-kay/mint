import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth.schema";
import { transactionTypeEnum } from "./enums";

export const category = pgTable(
  "category",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    icon: text("icon").notNull(),
    type: transactionTypeEnum("type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("category_userId_idx").on(table.userId)],
);
