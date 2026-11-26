CREATE SCHEMA "menu";
--> statement-breakpoint
CREATE TABLE "menu"."items" (
	"id" text PRIMARY KEY NOT NULL,
	"outlet" text NOT NULL,
	"section" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" integer NOT NULL,
	"prep_minutes" integer NOT NULL,
	"options" jsonb NOT NULL,
	"tags" jsonb NOT NULL,
	"allergens" jsonb NOT NULL,
	"photo_url" text,
	"active" boolean NOT NULL,
	"visible_to_clients" boolean NOT NULL,
	"out_of_stock_on" text,
	"sort_order" integer NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "menu"."settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" text
);
--> statement-breakpoint
CREATE INDEX "items_outlet_idx" ON "menu"."items" USING btree ("outlet","section","sort_order");