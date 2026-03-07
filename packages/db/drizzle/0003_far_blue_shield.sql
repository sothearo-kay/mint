CREATE TABLE "settings" (
	"user_id" text PRIMARY KEY NOT NULL,
	"budget_limit" numeric(12, 2)
);
--> statement-breakpoint
ALTER TABLE "settings" ADD CONSTRAINT "settings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;