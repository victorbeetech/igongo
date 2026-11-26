CREATE SCHEMA "lost_found";
--> statement-breakpoint
CREATE TABLE "lost_found"."record_events" (
	"id" text PRIMARY KEY NOT NULL,
	"record_id" text NOT NULL,
	"kind" text NOT NULL,
	"text" text NOT NULL,
	"status" text,
	"by_id" text,
	"by_name" text NOT NULL,
	"at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lost_found"."records" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"status" text NOT NULL,
	"fields" jsonb NOT NULL,
	"owner_id" text,
	"owner_name" text NOT NULL,
	"assignee_id" text,
	"assignee_name" text,
	"due_on" text,
	"location" text,
	"created_by" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"closed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "lost_found"."settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" text
);
--> statement-breakpoint
CREATE INDEX "record_events_record_idx" ON "lost_found"."record_events" USING btree ("record_id","at");--> statement-breakpoint
CREATE UNIQUE INDEX "records_code_key" ON "lost_found"."records" USING btree ("code");--> statement-breakpoint
CREATE INDEX "records_type_idx" ON "lost_found"."records" USING btree ("type","status","updated_at");--> statement-breakpoint
CREATE INDEX "records_owner_idx" ON "lost_found"."records" USING btree ("owner_id","created_at");--> statement-breakpoint
CREATE INDEX "records_assignee_idx" ON "lost_found"."records" USING btree ("assignee_id","status");--> statement-breakpoint
CREATE INDEX "records_due_idx" ON "lost_found"."records" USING btree ("due_on");