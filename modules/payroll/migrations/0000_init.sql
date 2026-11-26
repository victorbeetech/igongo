CREATE SCHEMA "payroll";
--> statement-breakpoint
CREATE TABLE "payroll"."pay_profiles" (
	"staff_id" text PRIMARY KEY NOT NULL,
	"basic" bigint NOT NULL,
	"allowances" jsonb NOT NULL,
	"pay_method" text NOT NULL,
	"account" text,
	"active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payroll"."pay_runs" (
	"id" text PRIMARY KEY NOT NULL,
	"period" text NOT NULL,
	"status" text NOT NULL,
	"staff_count" integer NOT NULL,
	"gross" bigint NOT NULL,
	"deductions" bigint NOT NULL,
	"net" bigint NOT NULL,
	"employer_cost" bigint NOT NULL,
	"created_by_id" text NOT NULL,
	"created_by_name" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"approved_by_name" text,
	"approved_at" timestamp with time zone,
	"paid_by_name" text,
	"paid_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "payroll"."payslips" (
	"id" text PRIMARY KEY NOT NULL,
	"run_id" text NOT NULL,
	"period" text NOT NULL,
	"staff_id" text NOT NULL,
	"staff_name" text NOT NULL,
	"staff_number" text NOT NULL,
	"department" text,
	"basic" bigint NOT NULL,
	"earnings" jsonb NOT NULL,
	"gross" bigint NOT NULL,
	"deductions" jsonb NOT NULL,
	"total_deductions" bigint NOT NULL,
	"net" bigint NOT NULL,
	"employer" jsonb NOT NULL,
	"adjustments" jsonb NOT NULL,
	"bonus_ids" text[] NOT NULL,
	"advance_lines" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payroll"."settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" text
);
--> statement-breakpoint
ALTER TABLE "payroll"."payslips" ADD CONSTRAINT "payslips_run_id_pay_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "payroll"."pay_runs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pay_runs_period_idx" ON "payroll"."pay_runs" USING btree ("period");--> statement-breakpoint
CREATE INDEX "payslips_run_idx" ON "payroll"."payslips" USING btree ("run_id");--> statement-breakpoint
CREATE INDEX "payslips_staff_idx" ON "payroll"."payslips" USING btree ("staff_id","period");