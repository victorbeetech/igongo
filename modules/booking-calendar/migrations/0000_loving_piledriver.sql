CREATE SCHEMA "booking_calendar";
--> statement-breakpoint
CREATE TABLE "booking_calendar"."settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" text
);
