ALTER TABLE "orders"."orders" ADD COLUMN "points_spent" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "orders"."orders" ADD COLUMN "points_discount" integer DEFAULT 0 NOT NULL;