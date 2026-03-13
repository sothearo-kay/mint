CREATE TABLE "wallet_transfer" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"from_wallet_id" text NOT NULL,
	"to_wallet_id" text NOT NULL,
	"from_amount" numeric(12, 2) NOT NULL,
	"to_amount" numeric(12, 2) NOT NULL,
	"note" text,
	"date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "wallet_transfer" ADD CONSTRAINT "wallet_transfer_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_transfer" ADD CONSTRAINT "wallet_transfer_from_wallet_id_wallet_id_fk" FOREIGN KEY ("from_wallet_id") REFERENCES "public"."wallet"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_transfer" ADD CONSTRAINT "wallet_transfer_to_wallet_id_wallet_id_fk" FOREIGN KEY ("to_wallet_id") REFERENCES "public"."wallet"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "wallet_transfer_userId_idx" ON "wallet_transfer" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "wallet_transfer_fromWalletId_idx" ON "wallet_transfer" USING btree ("from_wallet_id");--> statement-breakpoint
CREATE INDEX "wallet_transfer_toWalletId_idx" ON "wallet_transfer" USING btree ("to_wallet_id");
