CREATE SCHEMA "notifications";
--> statement-breakpoint
CREATE TYPE "notifications"."device_platform" AS ENUM('android', 'ios', 'web');--> statement-breakpoint
CREATE TABLE "notifications"."device_tokens" (
	"token" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"platform" "notifications"."device_platform" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "device_tokens_user_id_idx" ON "notifications"."device_tokens" USING btree ("user_id");