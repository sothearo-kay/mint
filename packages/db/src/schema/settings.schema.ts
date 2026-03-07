import { numeric, pgTable, text } from "drizzle-orm/pg-core";

import { user } from "./auth.schema";

export const settings = pgTable("settings", {
  userId: text("user_id").primaryKey().references(() => user.id, { onDelete: "cascade" }),
  budgetLimitUSD: numeric("budget_limit_usd", { precision: 12, scale: 2 }),
  budgetLimitKHR: numeric("budget_limit_khr", { precision: 16, scale: 2 }),
});
