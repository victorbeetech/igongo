CREATE SCHEMA "reports";
--> statement-breakpoint
CREATE TYPE "reports"."report_status" AS ENUM('draft', 'submitted', 'signed', 'returned');--> statement-breakpoint
CREATE TABLE "reports"."daily_reports" (
	"id" text PRIMARY KEY NOT NULL,
	"staff_id" text NOT NULL,
	"department" text,
	"work_date" text NOT NULL,
	"status" "reports"."report_status" NOT NULL,
	"sections" jsonb NOT NULL,
	"photo_urls" jsonb NOT NULL,
	"submitted_at" timestamp with time zone,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"review_note" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports"."report_comments" (
	"id" text PRIMARY KEY NOT NULL,
	"report_id" text NOT NULL,
	"author_id" text NOT NULL,
	"author_name" text NOT NULL,
	"body" text NOT NULL,
	"at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports"."settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" text
);
--> statement-breakpoint
ALTER TABLE "reports"."report_comments" ADD CONSTRAINT "report_comments_report_id_daily_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "reports"."daily_reports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "daily_reports_staff_day_key" ON "reports"."daily_reports" USING btree ("staff_id","work_date");--> statement-breakpoint
CREATE INDEX "daily_reports_day_idx" ON "reports"."daily_reports" USING btree ("work_date","department");--> statement-breakpoint
CREATE INDEX "report_comments_report_idx" ON "reports"."report_comments" USING btree ("report_id","at");