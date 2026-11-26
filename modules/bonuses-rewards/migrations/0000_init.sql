CREATE SCHEMA "bonuses";
--> statement-breakpoint
CREATE TABLE "bonuses"."bonuses" (
	"id" text PRIMARY KEY NOT NULL,
	"staff_id" text NOT NULL,
	"staff_name" text NOT NULL,
	"department" text,
	"kind" text NOT NULL,
	"amount" bigint NOT NULL,
	"passes" integer NOT NULL,
	"passes_used" integer DEFAULT 0 NOT NULL,
	"valid_until" date,
	"reason" text NOT NULL,
	"status" text NOT NULL,
	"awarded_by_name" text NOT NULL,
	"decided_by_name" text,
	"decided_at" timestamp with time zone,
	"pay_run_id" text,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bonuses"."buffet_uses" (
	"id" text PRIMARY KEY NOT NULL,
	"bonus_id" text NOT NULL,
	"staff_id" text NOT NULL,
	"work_date" date NOT NULL,
	"served_by_name" text NOT NULL,
	"at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bonuses"."settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" text
);
--> statement-breakpoint
ALTER TABLE "bonuses"."buffet_uses" ADD CONSTRAINT "buffet_uses_bonus_id_bonuses_id_fk" FOREIGN KEY ("bonus_id") REFERENCES "bonuses"."bonuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bonuses_staff_idx" ON "bonuses"."bonuses" USING btree ("staff_id","created_at");--> statement-breakpoint
CREATE INDEX "bonuses_status_idx" ON "bonuses"."bonuses" USING btree ("kind","status");--> statement-breakpoint
CREATE INDEX "buffet_uses_staff_idx" ON "bonuses"."buffet_uses" USING btree ("staff_id","work_date");