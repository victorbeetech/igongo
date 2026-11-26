DROP INDEX "delivery"."jobs_order_key";--> statement-breakpoint
ALTER TABLE "delivery"."jobs" ADD COLUMN "source" text DEFAULT 'food' NOT NULL;--> statement-breakpoint
ALTER TABLE "delivery"."jobs" ADD COLUMN "what" text;--> statement-breakpoint
CREATE UNIQUE INDEX "jobs_source_order_key" ON "delivery"."jobs" USING btree ("source","order_id");--> statement-breakpoint
CREATE INDEX "jobs_customer_idx" ON "delivery"."jobs" USING btree ("customer_user_id","opened_at");