ALTER TABLE "settings" RENAME COLUMN "budget_limit" TO "budget_limit_usd";
ALTER TABLE "settings" ADD COLUMN "budget_limit_khr" numeric(16, 2);