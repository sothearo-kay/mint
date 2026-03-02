import { pgEnum } from "drizzle-orm/pg-core";

export const transactionTypeEnum = pgEnum("transaction_type", [
  "income",
  "expense",
]);

export const currencyEnum = pgEnum("currency", ["USD", "KHR"]);

export const frequencyEnum = pgEnum("frequency", [
  "daily",
  "weekly",
  "monthly",
  "yearly",
]);

export const budgetPeriodEnum = pgEnum("budget_period", [
  "weekly",
  "monthly",
  "yearly",
]);
