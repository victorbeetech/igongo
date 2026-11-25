CREATE SCHEMA "super_admin";
--> statement-breakpoint
CREATE TABLE "super_admin"."module_switches" (
	"module_key" text PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"maintenance" boolean DEFAULT false NOT NULL,
	"message" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" text
);
--> statement-breakpoint
CREATE TABLE "super_admin"."secrets" (
	"key" text PRIMARY KEY NOT NULL,
	"sealed" text NOT NULL,
	"last_four" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" text
);
--> statement-breakpoint
CREATE TABLE "super_admin"."settings" (
	"section" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" text
);
