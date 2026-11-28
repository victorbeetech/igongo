CREATE TABLE "orders"."saved_dishes" (
	"user_id" text NOT NULL,
	"item_id" text NOT NULL,
	"outlet" text NOT NULL,
	"saved_at" timestamp with time zone NOT NULL,
	CONSTRAINT "saved_dishes_user_id_item_id_pk" PRIMARY KEY("user_id","item_id")
);
--> statement-breakpoint
CREATE INDEX "saved_dishes_user_idx" ON "orders"."saved_dishes" USING btree ("user_id","saved_at");