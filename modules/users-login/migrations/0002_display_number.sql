-- Short profile number per account (shown as 00001). Hand-written so existing
-- accounts are numbered in creation order; drizzle's generated version would
-- fail on existing rows (NOT NULL with no value).
CREATE SEQUENCE "users_login"."user_display_number_seq" AS bigint START 1;
--> statement-breakpoint
ALTER TABLE "users_login"."user" ADD COLUMN "display_number" bigint;
--> statement-breakpoint
-- Backfill: oldest account gets 1, then 2, and so on (ties broken by ID so the result is stable).
UPDATE "users_login"."user" AS u SET "display_number" = o.rn FROM (SELECT "id", row_number() OVER (ORDER BY "created_at", "id") AS rn FROM "users_login"."user") AS o WHERE u."id" = o."id";
--> statement-breakpoint
-- The next number is one above the highest existing one (1 when there are no accounts yet).
SELECT setval('"users_login"."user_display_number_seq"', COALESCE((SELECT MAX("display_number") FROM "users_login"."user"), 0) + 1, false);
--> statement-breakpoint
ALTER SEQUENCE "users_login"."user_display_number_seq" OWNED BY "users_login"."user"."display_number";
--> statement-breakpoint
ALTER TABLE "users_login"."user" ALTER COLUMN "display_number" SET DEFAULT nextval('"users_login"."user_display_number_seq"');
--> statement-breakpoint
ALTER TABLE "users_login"."user" ALTER COLUMN "display_number" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "users_login"."user" ADD CONSTRAINT "user_display_number_unique" UNIQUE ("display_number");
