CREATE SCHEMA "points_rewards";
--> statement-breakpoint
CREATE TABLE "points_rewards"."events" (
	"id" text PRIMARY KEY NOT NULL,
	"guest_id" text NOT NULL,
	"kind" text NOT NULL,
	"points" integer NOT NULL,
	"source_ref" text NOT NULL,
	"note" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "points_rewards"."lots" (
	"id" text PRIMARY KEY NOT NULL,
	"guest_id" text NOT NULL,
	"earned" integer NOT NULL,
	"remaining" integer NOT NULL,
	"earned_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone,
	"source_ref" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "points_rewards"."settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" text
);
--> statement-breakpoint
CREATE UNIQUE INDEX "events_source_ref_key" ON "points_rewards"."events" USING btree ("source_ref");--> statement-breakpoint
CREATE UNIQUE INDEX "lots_source_ref_key" ON "points_rewards"."lots" USING btree ("source_ref");