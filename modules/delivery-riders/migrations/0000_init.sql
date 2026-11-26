CREATE SCHEMA "delivery";
--> statement-breakpoint
CREATE TABLE "delivery"."jobs" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"order_number" text NOT NULL,
	"customer_user_id" text,
	"customer_name" text NOT NULL,
	"customer_phone" text,
	"place" jsonb NOT NULL,
	"fee" integer NOT NULL,
	"minutes" integer NOT NULL,
	"cash_to_collect" integer NOT NULL,
	"status" text NOT NULL,
	"rider_user_id" text,
	"rider_name" text,
	"code" text NOT NULL,
	"cash_collected" integer NOT NULL,
	"cash_handed_in" boolean NOT NULL,
	"fail_reason" text,
	"opened_at" timestamp with time zone NOT NULL,
	"assigned_at" timestamp with time zone,
	"picked_up_at" timestamp with time zone,
	"finished_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "delivery"."riders" (
	"user_id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"online" boolean NOT NULL,
	"lat" double precision,
	"lng" double precision,
	"location_at" timestamp with time zone,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "delivery"."settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" text
);
--> statement-breakpoint
CREATE UNIQUE INDEX "jobs_order_key" ON "delivery"."jobs" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "jobs_status_idx" ON "delivery"."jobs" USING btree ("status","opened_at");--> statement-breakpoint
CREATE INDEX "jobs_rider_idx" ON "delivery"."jobs" USING btree ("rider_user_id","opened_at");