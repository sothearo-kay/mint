import { numeric, pgTable, text } from "drizzle-orm/pg-core";

import { user } from "./auth.schema";

export const settings = pgTable("settings", {
  userId: text("user_id").primaryKey().references(() => user.id, { onDelete: "cascade" }),
  budgetLimit: numeric("budget_limit", { precision: 12, scale: 2 }),
});
