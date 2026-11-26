CREATE SCHEMA "crm";
--> statement-breakpoint
CREATE TABLE "crm"."profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"nationality" text,
	"birthday" text,
	"preferences" text,
	"allergies" text,
	"tags" jsonb NOT NULL,
	"consent" jsonb NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crm"."settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" text
);
--> statement-breakpoint
CREATE TABLE "crm"."staff_notes" (
	"id" text PRIMARY KEY NOT NULL,
	"profile_id" text NOT NULL,
	"text" text NOT NULL,
	"by_user_id" text,
	"by_name" text,
	"at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "profiles_user_key" ON "crm"."profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "profiles_name_idx" ON "crm"."profiles" USING btree ("name");--> statement-breakpoint
CREATE INDEX "profiles_phone_idx" ON "crm"."profiles" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "staff_notes_profile_idx" ON "crm"."staff_notes" USING btree ("profile_id");