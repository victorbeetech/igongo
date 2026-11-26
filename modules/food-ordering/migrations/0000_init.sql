CREATE SCHEMA "orders";
--> statement-breakpoint
CREATE TABLE "orders"."orders" (
	"id" text PRIMARY KEY NOT NULL,
	"seq" integer NOT NULL,
	"user_id" text,
	"customer_name" text NOT NULL,
	"customer_phone" text,
	"outlet" text NOT NULL,
	"type" text NOT NULL,
	"channel" text NOT NULL,
	"status" text NOT NULL,
	"lines" jsonb NOT NULL,
	"notes" text,
	"allergies" text,
	"table_label" text,
	"deliver_to" jsonb,
	"subtotal" integer NOT NULL,
	"delivery_fee" integer NOT NULL,
	"total" integer NOT NULL,
	"paid" integer NOT NULL,
	"arrive_at" timestamp with time zone,
	"ready_at" timestamp with time zone NOT NULL,
	"taken_by" text,
	"history" jsonb NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders"."settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" text
);
--> statement-breakpoint
CREATE UNIQUE INDEX "orders_seq_key" ON "orders"."orders" USING btree ("seq");--> statement-breakpoint
CREATE INDEX "orders_board_idx" ON "orders"."orders" USING btree ("outlet","status","ready_at");--> statement-breakpoint
CREATE INDEX "orders_user_idx" ON "orders"."orders" USING btree ("user_id","created_at");