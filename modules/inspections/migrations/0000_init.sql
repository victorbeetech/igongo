CREATE SCHEMA "inspections";
--> statement-breakpoint
CREATE TABLE "inspections"."checklists" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"department" text NOT NULL,
	"frequency" text NOT NULL,
	"due_by" text NOT NULL,
	"items" jsonb NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inspections"."run_comments" (
	"id" text PRIMARY KEY NOT NULL,
	"run_id" text NOT NULL,
	"author_id" text NOT NULL,
	"author_name" text NOT NULL,
	"body" text NOT NULL,
	"at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inspections"."run_likes" (
	"run_id" text NOT NULL,
	"user_id" text NOT NULL,
	"at" timestamp with time zone NOT NULL,
	CONSTRAINT "run_likes_run_id_user_id_pk" PRIMARY KEY("run_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "inspections"."runs" (
	"id" text PRIMARY KEY NOT NULL,
	"checklist_id" text NOT NULL,
	"checklist_name" text NOT NULL,
	"department" text NOT NULL,
	"work_date" date NOT NULL,
	"inspector_user_id" text NOT NULL,
	"inspector_staff_id" text,
	"inspector_name" text NOT NULL,
	"results" jsonb NOT NULL,
	"score" integer NOT NULL,
	"faults" integer NOT NULL,
	"note" text,
	"submitted_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inspections"."settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" text
);
--> statement-breakpoint
ALTER TABLE "inspections"."run_comments" ADD CONSTRAINT "run_comments_run_id_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "inspections"."runs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inspections"."run_likes" ADD CONSTRAINT "run_likes_run_id_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "inspections"."runs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inspections"."runs" ADD CONSTRAINT "runs_checklist_id_checklists_id_fk" FOREIGN KEY ("checklist_id") REFERENCES "inspections"."checklists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "run_comments_run_idx" ON "inspections"."run_comments" USING btree ("run_id","at");--> statement-breakpoint
CREATE INDEX "runs_checklist_idx" ON "inspections"."runs" USING btree ("checklist_id","work_date");--> statement-breakpoint
CREATE INDEX "runs_department_idx" ON "inspections"."runs" USING btree ("department","work_date");