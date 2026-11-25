CREATE SCHEMA "cards";
--> statement-breakpoint
CREATE TYPE "cards"."card_action" AS ENUM('registered', 'encoded', 'issued', 'reset', 'lost');--> statement-breakpoint
CREATE TYPE "cards"."card_status" AS ENUM('unassigned', 'active', 'lost', 'revoked');--> statement-breakpoint
CREATE TABLE "cards"."card_history" (
	"id" text PRIMARY KEY NOT NULL,
	"card_id" text NOT NULL,
	"action" "cards"."card_action" NOT NULL,
	"staff_id" text,
	"actor_id" text,
	"at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cards"."cards" (
	"card_id" text PRIMARY KEY NOT NULL,
	"card_number" text NOT NULL,
	"uid" text,
	"qr_token" text NOT NULL,
	"card_type" text NOT NULL,
	"template_key" text NOT NULL,
	"staff_id" text,
	"status" "cards"."card_status" DEFAULT 'unassigned' NOT NULL,
	"issued_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cards"."card_history" ADD CONSTRAINT "card_history_card_id_cards_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "cards"."cards"("card_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "card_history_card_idx" ON "cards"."card_history" USING btree ("card_id","at");--> statement-breakpoint
CREATE UNIQUE INDEX "cards_number_key" ON "cards"."cards" USING btree ("card_number");--> statement-breakpoint
CREATE UNIQUE INDEX "cards_uid_key" ON "cards"."cards" USING btree ("uid");--> statement-breakpoint
CREATE UNIQUE INDEX "cards_qr_token_key" ON "cards"."cards" USING btree ("qr_token");--> statement-breakpoint
CREATE INDEX "cards_staff_idx" ON "cards"."cards" USING btree ("staff_id");