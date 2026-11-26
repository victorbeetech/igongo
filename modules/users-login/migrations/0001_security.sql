CREATE TABLE "users_login"."failed_logins" (
	"email" text PRIMARY KEY NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"locked_until" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users_login"."known_devices" (
	"user_id" text NOT NULL,
	"device_key" text NOT NULL,
	"label" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "known_devices_user_id_device_key_pk" PRIMARY KEY("user_id","device_key")
);
--> statement-breakpoint
ALTER TABLE "users_login"."known_devices" ADD CONSTRAINT "known_devices_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users_login"."user"("id") ON DELETE cascade ON UPDATE no action;