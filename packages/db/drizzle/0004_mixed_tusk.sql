CREATE TYPE "public"."wallet_type" AS ENUM('cash', 'bank', 'savings');--> statement-breakpoint
CREATE TABLE "wallet" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"currency" "currency" NOT NULL,
	"type" "wallet_type" DEFAULT 'cash' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "recurring_transaction" ADD COLUMN "wallet_id" text;--> statement-breakpoint
ALTER TABLE "recurring_transaction" ADD COLUMN "logo" text;--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "wallet_id" text;--> statement-breakpoint
ALTER TABLE "wallet" ADD CONSTRAINT "wallet_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "wallet_userId_idx" ON "wallet" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "recurring_transaction" ADD CONSTRAINT "recurring_transaction_wallet_id_wallet_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallet"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_wallet_id_wallet_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallet"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "transaction_walletId_idx" ON "transaction" USING btree ("wallet_id");