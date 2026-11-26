CREATE TABLE "analytics"."report_runs" (
	"id" text PRIMARY KEY NOT NULL,
	"report_id" text NOT NULL,
	"report_name" text NOT NULL,
	"from_day" text NOT NULL,
	"to_day" text NOT NULL,
	"trigger" text NOT NULL,
	"groups" jsonb NOT NULL,
	"ran_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "analytics"."saved_reports" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"owner_id" text NOT NULL,
	"owner_name" text NOT NULL,
	"modules" text[] NOT NULL,
	"days" integer NOT NULL,
	"schedule" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"last_run_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX "report_runs_report_idx" ON "analytics"."report_runs" USING btree ("report_id","ran_at");--> statement-breakpoint
CREATE INDEX "saved_reports_owner_idx" ON "analytics"."saved_reports" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "saved_reports_schedule_idx" ON "analytics"."saved_reports" USING btree ("schedule");