CREATE SCHEMA "faults";
--> statement-breakpoint
CREATE TABLE "faults"."fault_comments" (
	"id" text PRIMARY KEY NOT NULL,
	"fault_id" text NOT NULL,
	"author_id" text NOT NULL,
	"author_name" text NOT NULL,
	"body" text NOT NULL,
	"at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "faults"."fault_events" (
	"id" text PRIMARY KEY NOT NULL,
	"fault_id" text NOT NULL,
	"by_id" text,
	"by_name" text NOT NULL,
	"from_status" text,
	"to_status" text NOT NULL,
	"note" text,
	"at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "faults"."fault_likes" (
	"fault_id" text NOT NULL,
	"user_id" text NOT NULL,
	"at" timestamp with time zone NOT NULL,
	CONSTRAINT "fault_likes_fault_id_user_id_pk" PRIMARY KEY("fault_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "faults"."faults" (
	"id" text PRIMARY KEY NOT NULL,
	"number" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text,
	"location" text,
	"department" text,
	"priority" text NOT NULL,
	"status" text NOT NULL,
	"photo_ids" text[] NOT NULL,
	"reporter_user_id" text,
	"reporter_staff_id" text,
	"reporter_name" text NOT NULL,
	"assigned_user_id" text,
	"assigned_staff_id" text,
	"assigned_name" text,
	"source_module" text NOT NULL,
	"source_record_id" text,
	"fix_note" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"fixed_at" timestamp with time zone,
	"closed_at" timestamp with time zone,
	CONSTRAINT "faults_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE "faults"."settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" text
);
--> statement-breakpoint
ALTER TABLE "faults"."fault_comments" ADD CONSTRAINT "fault_comments_fault_id_faults_id_fk" FOREIGN KEY ("fault_id") REFERENCES "faults"."faults"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faults"."fault_events" ADD CONSTRAINT "fault_events_fault_id_faults_id_fk" FOREIGN KEY ("fault_id") REFERENCES "faults"."faults"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faults"."fault_likes" ADD CONSTRAINT "fault_likes_fault_id_faults_id_fk" FOREIGN KEY ("fault_id") REFERENCES "faults"."faults"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "fault_comments_fault_idx" ON "faults"."fault_comments" USING btree ("fault_id","at");--> statement-breakpoint
CREATE INDEX "fault_events_fault_idx" ON "faults"."fault_events" USING btree ("fault_id","at");--> statement-breakpoint
CREATE INDEX "faults_status_idx" ON "faults"."faults" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "faults_department_idx" ON "faults"."faults" USING btree ("department","created_at");