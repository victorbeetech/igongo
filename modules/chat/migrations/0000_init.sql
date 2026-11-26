CREATE SCHEMA "chat";
--> statement-breakpoint
CREATE TABLE "chat"."conversations" (
	"id" text PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"title" text,
	"desk_key" text,
	"created_by" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"last_message_at" timestamp with time zone,
	"last_preview" text
);
--> statement-breakpoint
CREATE TABLE "chat"."members" (
	"conversation_id" text NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"last_read_at" timestamp with time zone,
	"joined_at" timestamp with time zone NOT NULL,
	CONSTRAINT "members_conversation_id_user_id_pk" PRIMARY KEY("conversation_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "chat"."messages" (
	"id" text PRIMARY KEY NOT NULL,
	"conversation_id" text NOT NULL,
	"sender_id" text NOT NULL,
	"sender_name" text NOT NULL,
	"body" text NOT NULL,
	"file_ids" text[] NOT NULL,
	"at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat"."settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" text
);
--> statement-breakpoint
ALTER TABLE "chat"."members" ADD CONSTRAINT "members_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "chat"."conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat"."messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "chat"."conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "conversations_desk_idx" ON "chat"."conversations" USING btree ("desk_key","last_message_at");--> statement-breakpoint
CREATE INDEX "members_user_idx" ON "chat"."members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "messages_conversation_idx" ON "chat"."messages" USING btree ("conversation_id","at");