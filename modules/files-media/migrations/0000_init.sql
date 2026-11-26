CREATE SCHEMA "files";
--> statement-breakpoint
CREATE TABLE "files"."files" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"size" bigint NOT NULL,
	"key" text NOT NULL,
	"purpose" text NOT NULL,
	"uploaded_by" text NOT NULL,
	"uploader_name" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"removed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "files"."settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" text
);
--> statement-breakpoint
CREATE INDEX "files_purpose_idx" ON "files"."files" USING btree ("purpose","created_at");