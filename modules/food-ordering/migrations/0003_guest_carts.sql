CREATE TABLE "orders"."carts" (
	"user_id" text PRIMARY KEY NOT NULL,
	"outlet" text,
	"lines" jsonb NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
