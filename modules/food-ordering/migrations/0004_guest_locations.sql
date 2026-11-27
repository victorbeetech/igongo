CREATE TABLE "orders"."delivery_pins" (
	"user_id" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"zone" text,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
