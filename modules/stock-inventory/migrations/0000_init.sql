CREATE SCHEMA "stock";
--> statement-breakpoint
CREATE TABLE "stock"."record_events" (
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
CREATE TABLE "stock"."items" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"unit" text NOT NULL,
	"conversions" jsonb NOT NULL,
	"reorder_level" numeric(14, 3) NOT NULL,
	"avg_cost" integer NOT NULL,
	"tracks_expiry" boolean NOT NULL,
	"photo_id" text,
	"extra" jsonb NOT NULL,
	"active" boolean NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stock"."movements" (
	"id" text PRIMARY KEY NOT NULL,
	"number" text NOT NULL,
	"kind" text NOT NULL,
	"item_id" text NOT NULL,
	"item_name" text NOT NULL,
	"from_store_id" text,
	"to_store_id" text,
	"qty" numeric(14, 3) NOT NULL,
	"unit_cost" integer NOT NULL,
	"reference" text,
	"issued_to" text,
	"batch" text,
	"expires_on" text,
	"note" text,
	"by_id" text,
	"by_name" text NOT NULL,
	"at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stock"."records" (
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
CREATE TABLE "stock"."settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" text
);
--> statement-breakpoint
CREATE TABLE "stock"."stores" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"kind" text NOT NULL,
	"department" text,
	"keeper_staff_id" text,
	"location" text,
	"active" boolean NOT NULL
);
--> statement-breakpoint
CREATE INDEX "record_events_record_idx" ON "stock"."record_events" USING btree ("record_id","at");--> statement-breakpoint
CREATE UNIQUE INDEX "items_code_key" ON "stock"."items" USING btree ("code");--> statement-breakpoint
CREATE INDEX "items_category_idx" ON "stock"."items" USING btree ("category","name");--> statement-breakpoint
CREATE UNIQUE INDEX "movements_number_key" ON "stock"."movements" USING btree ("number");--> statement-breakpoint
CREATE INDEX "movements_item_idx" ON "stock"."movements" USING btree ("item_id","at");--> statement-breakpoint
CREATE INDEX "movements_from_idx" ON "stock"."movements" USING btree ("from_store_id","item_id");--> statement-breakpoint
CREATE INDEX "movements_to_idx" ON "stock"."movements" USING btree ("to_store_id","item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "records_code_key" ON "stock"."records" USING btree ("code");--> statement-breakpoint
CREATE INDEX "records_type_idx" ON "stock"."records" USING btree ("type","status","updated_at");--> statement-breakpoint
CREATE INDEX "records_owner_idx" ON "stock"."records" USING btree ("owner_id","created_at");--> statement-breakpoint
CREATE INDEX "records_assignee_idx" ON "stock"."records" USING btree ("assignee_id","status");--> statement-breakpoint
CREATE INDEX "records_due_idx" ON "stock"."records" USING btree ("due_on");