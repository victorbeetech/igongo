CREATE SCHEMA "meals";
--> statement-breakpoint
CREATE TYPE "meals"."claim_method" AS ENUM('nfc', 'qr', 'manual');--> statement-breakpoint
CREATE TABLE "meals"."meal_claims" (
	"id" text PRIMARY KEY NOT NULL,
	"staff_id" text NOT NULL,
	"department" text,
	"work_date" text NOT NULL,
	"meal_key" text NOT NULL,
	"method" "meals"."claim_method" NOT NULL,
	"served_by" text,
	"at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meals"."settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" text
);
--> statement-breakpoint
CREATE UNIQUE INDEX "meal_claims_once_key" ON "meals"."meal_claims" USING btree ("staff_id","work_date","meal_key");--> statement-breakpoint
CREATE INDEX "meal_claims_day_idx" ON "meals"."meal_claims" USING btree ("work_date","department");