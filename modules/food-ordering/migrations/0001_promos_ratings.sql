CREATE TABLE "orders"."ratings" (
	"order_id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"outlet" text NOT NULL,
	"item_ids" text[] NOT NULL,
	"food" smallint NOT NULL,
	"delivery" smallint,
	"comment" text,
	"hidden" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders"."orders" ADD COLUMN "discount" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "orders"."orders" ADD COLUMN "promo_code" text;--> statement-breakpoint
ALTER TABLE "orders"."orders" ADD COLUMN "request_key" text;--> statement-breakpoint
CREATE INDEX "ratings_outlet_idx" ON "orders"."ratings" USING btree ("outlet","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "orders_request_key" ON "orders"."orders" USING btree ("user_id","request_key");