CREATE SCHEMA "bands";
--> statement-breakpoint
CREATE TYPE "bands"."band_status" AS ENUM('in_stock', 'assigned', 'missing', 'retired');--> statement-breakpoint
CREATE TYPE "bands"."scan_result" AS ENUM('ok', 'not_assigned', 'wrong_event', 'blocked', 'unknown');--> statement-breakpoint
CREATE TABLE "bands"."band_scans" (
	"id" text PRIMARY KEY NOT NULL,
	"band_number" integer,
	"event_key" text,
	"result" "bands"."scan_result" NOT NULL,
	"actor_id" text,
	"at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bands"."wristbands" (
	"band_number" integer PRIMARY KEY NOT NULL,
	"uid" text,
	"qr_token" text NOT NULL,
	"band_type" text NOT NULL,
	"status" "bands"."band_status" DEFAULT 'in_stock' NOT NULL,
	"event_key" text,
	"event_name" text,
	"assigned_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "band_scans_event_idx" ON "bands"."band_scans" USING btree ("event_key","at");--> statement-breakpoint
CREATE INDEX "band_scans_band_idx" ON "bands"."band_scans" USING btree ("band_number","at");--> statement-breakpoint
CREATE UNIQUE INDEX "wristbands_uid_key" ON "bands"."wristbands" USING btree ("uid");--> statement-breakpoint
CREATE INDEX "wristbands_event_idx" ON "bands"."wristbands" USING btree ("event_key");--> statement-breakpoint
CREATE INDEX "wristbands_status_idx" ON "bands"."wristbands" USING btree ("status");