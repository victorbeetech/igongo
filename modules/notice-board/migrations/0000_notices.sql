CREATE SCHEMA "notices";
--> statement-breakpoint
CREATE TABLE "notices"."notice_comments" (
	"id" text PRIMARY KEY NOT NULL,
	"notice_id" text NOT NULL,
	"author_id" text NOT NULL,
	"author_name" text NOT NULL,
	"body" text NOT NULL,
	"at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notices"."notice_likes" (
	"notice_id" text NOT NULL,
	"user_id" text NOT NULL,
	"at" timestamp with time zone NOT NULL,
	CONSTRAINT "notice_likes_notice_id_user_id_pk" PRIMARY KEY("notice_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "notices"."notice_reads" (
	"notice_id" text NOT NULL,
	"user_id" text NOT NULL,
	"at" timestamp with time zone NOT NULL,
	CONSTRAINT "notice_reads_notice_id_user_id_pk" PRIMARY KEY("notice_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "notices"."notices" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"author_id" text NOT NULL,
	"author_name" text NOT NULL,
	"audience_roles" text[] NOT NULL,
	"pinned" boolean DEFAULT false NOT NULL,
	"allow_comments" boolean DEFAULT true NOT NULL,
	"allow_likes" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"removed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "notices"."settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" text
);
--> statement-breakpoint
ALTER TABLE "notices"."notice_comments" ADD CONSTRAINT "notice_comments_notice_id_notices_id_fk" FOREIGN KEY ("notice_id") REFERENCES "notices"."notices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notices"."notice_likes" ADD CONSTRAINT "notice_likes_notice_id_notices_id_fk" FOREIGN KEY ("notice_id") REFERENCES "notices"."notices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notices"."notice_reads" ADD CONSTRAINT "notice_reads_notice_id_notices_id_fk" FOREIGN KEY ("notice_id") REFERENCES "notices"."notices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "notice_comments_notice_idx" ON "notices"."notice_comments" USING btree ("notice_id","at");--> statement-breakpoint
CREATE INDEX "notices_board_idx" ON "notices"."notices" USING btree ("pinned","created_at");