CREATE SCHEMA "pool";
--> statement-breakpoint
CREATE TABLE "pool"."bookings" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"offering_id" text NOT NULL,
	"offering_name" text NOT NULL,
	"kind" text NOT NULL,
	"user_id" text,
	"guest_name" text NOT NULL,
	"guest_phone" text,
	"date" text,
	"end_date" text,
	"slot" text,
	"units" integer NOT NULL,
	"total" integer NOT NULL,
	"paid" integer NOT NULL,
	"status" text NOT NULL,
	"notes" text,
	"created_by" text,
	"cancel_reason" text,
	"checked_in_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pool"."offerings" (
	"id" text PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" integer NOT NULL,
	"capacity" integer NOT NULL,
	"slots" jsonb NOT NULL,
	"on_date" text,
	"photo_url" text,
	"details" jsonb NOT NULL,
	"active" boolean NOT NULL,
	"visible_to_clients" boolean NOT NULL,
	"sort_order" integer NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pool"."settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" text
);
--> statement-breakpoint
CREATE UNIQUE INDEX "bookings_code_key" ON "pool"."bookings" USING btree ("code");--> statement-breakpoint
CREATE INDEX "bookings_offering_idx" ON "pool"."bookings" USING btree ("offering_id","date");--> statement-breakpoint
CREATE INDEX "bookings_user_idx" ON "pool"."bookings" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "bookings_day_idx" ON "pool"."bookings" USING btree ("date","status");