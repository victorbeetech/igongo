CREATE SCHEMA "advances";
--> statement-breakpoint
CREATE TABLE "advances"."advances" (
	"id" text PRIMARY KEY NOT NULL,
	"number" text NOT NULL,
	"staff_id" text NOT NULL,
	"staff_name" text NOT NULL,
	"department" text,
	"kind" text NOT NULL,
	"amount" bigint NOT NULL,
	"reason" text NOT NULL,
	"instalments" integer NOT NULL,
	"instalment_amount" bigint NOT NULL,
	"start_period" text NOT NULL,
	"status" text NOT NULL,
	"repaid" bigint DEFAULT 0 NOT NULL,
	"requested_at" timestamp with time zone NOT NULL,
	"decided_by_name" text,
	"decided_at" timestamp with time zone,
	"decision_note" text,
	"disbursed_by_name" text,
	"disbursed_at" timestamp with time zone,
	CONSTRAINT "advances_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE "advances"."repayments" (
	"id" text PRIMARY KEY NOT NULL,
	"advance_id" text NOT NULL,
	"period" text NOT NULL,
	"amount" bigint NOT NULL,
	"pay_run_id" text,
	"by_name" text NOT NULL,
	"at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "advances"."settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" text
);
--> statement-breakpoint
ALTER TABLE "advances"."repayments" ADD CONSTRAINT "repayments_advance_id_advances_id_fk" FOREIGN KEY ("advance_id") REFERENCES "advances"."advances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "advances_staff_idx" ON "advances"."advances" USING btree ("staff_id","requested_at");--> statement-breakpoint
CREATE INDEX "advances_status_idx" ON "advances"."advances" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "repayments_run_uq" ON "advances"."repayments" USING btree ("advance_id","period","pay_run_id");--> statement-breakpoint
CREATE INDEX "repayments_advance_idx" ON "advances"."repayments" USING btree ("advance_id","at");