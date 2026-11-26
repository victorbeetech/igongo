CREATE SCHEMA "payments";
--> statement-breakpoint
CREATE TABLE "payments"."payments" (
	"id" text PRIMARY KEY NOT NULL,
	"module" text NOT NULL,
	"record_id" text NOT NULL,
	"label" text NOT NULL,
	"outlet" text,
	"method" text NOT NULL,
	"amount" integer NOT NULL,
	"status" text NOT NULL,
	"payer_user_id" text,
	"payer_phone" text,
	"provider_ref" text,
	"redirect_url" text,
	"message" text,
	"recorded_by" text,
	"refunded_amount" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"settled_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "payments"."settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" text
);
--> statement-breakpoint
CREATE INDEX "payments_record_idx" ON "payments"."payments" USING btree ("module","record_id");--> statement-breakpoint
CREATE INDEX "payments_payer_idx" ON "payments"."payments" USING btree ("payer_user_id","created_at");--> statement-breakpoint
CREATE INDEX "payments_status_idx" ON "payments"."payments" USING btree ("status","created_at");