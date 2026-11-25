CREATE SCHEMA "audit";
--> statement-breakpoint
CREATE TABLE "audit"."events" (
	"seq" bigint PRIMARY KEY DEFAULT 0 NOT NULL,
	"id" text NOT NULL,
	"occurred_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"actor_id" text,
	"actor_name" text,
	"actor_role" text,
	"action" text NOT NULL,
	"module" text NOT NULL,
	"record_type" text,
	"record_id" text,
	"summary" text NOT NULL,
	"changes" jsonb,
	"context" jsonb,
	"prev_hash" text DEFAULT '' NOT NULL,
	"hash" text DEFAULT '' NOT NULL,
	CONSTRAINT "events_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE INDEX "events_actor_idx" ON "audit"."events" USING btree ("actor_id","occurred_at");--> statement-breakpoint
CREATE INDEX "events_module_idx" ON "audit"."events" USING btree ("module","occurred_at");--> statement-breakpoint
CREATE INDEX "events_record_idx" ON "audit"."events" USING btree ("record_type","record_id");--> statement-breakpoint
CREATE INDEX "events_occurred_idx" ON "audit"."events" USING btree ("occurred_at");