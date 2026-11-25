CREATE SCHEMA "attendance";
--> statement-breakpoint
CREATE TYPE "attendance"."clock_kind" AS ENUM('in', 'out');--> statement-breakpoint
CREATE TYPE "attendance"."clock_method" AS ENUM('nfc', 'qr', 'app', 'manual');--> statement-breakpoint
CREATE TABLE "attendance"."clock_events" (
	"id" text PRIMARY KEY NOT NULL,
	"staff_id" text NOT NULL,
	"department" text,
	"kind" "attendance"."clock_kind" NOT NULL,
	"method" "attendance"."clock_method" NOT NULL,
	"at" timestamp with time zone NOT NULL,
	"work_date" text NOT NULL,
	"station" text NOT NULL,
	"late" boolean DEFAULT false NOT NULL,
	"recorded_by" text,
	"note" text
);
--> statement-breakpoint
CREATE TABLE "attendance"."settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" text
);
--> statement-breakpoint
CREATE INDEX "clock_events_staff_at_idx" ON "attendance"."clock_events" USING btree ("staff_id","at");--> statement-breakpoint
CREATE INDEX "clock_events_date_idx" ON "attendance"."clock_events" USING btree ("work_date","department");