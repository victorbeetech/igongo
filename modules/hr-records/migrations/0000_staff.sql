CREATE SCHEMA "hr";
--> statement-breakpoint
CREATE TYPE "hr"."staff_status" AS ENUM('active', 'suspended', 'left');--> statement-breakpoint
CREATE TABLE "hr"."staff" (
	"staff_id" text PRIMARY KEY NOT NULL,
	"staff_number" text NOT NULL,
	"user_id" text,
	"name" text NOT NULL,
	"department" text,
	"job_title" text,
	"photo_url" text,
	"phone" text,
	"email" text,
	"hire_date" text,
	"emergency_contact" text,
	"status" "hr"."staff_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "staff_number_key" ON "hr"."staff" USING btree ("staff_number");--> statement-breakpoint
CREATE UNIQUE INDEX "staff_user_id_key" ON "hr"."staff" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "staff_department_idx" ON "hr"."staff" USING btree ("department");