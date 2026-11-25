CREATE SCHEMA "roles";
--> statement-breakpoint
CREATE TABLE "roles"."role_includes" (
	"role_id" text NOT NULL,
	"included_role_id" text NOT NULL,
	CONSTRAINT "role_includes_role_id_included_role_id_pk" PRIMARY KEY("role_id","included_role_id")
);
--> statement-breakpoint
CREATE TABLE "roles"."role_permissions" (
	"role_id" text NOT NULL,
	"permission_key" text NOT NULL,
	"scope" text DEFAULT 'all' NOT NULL,
	CONSTRAINT "role_permissions_role_id_permission_key_pk" PRIMARY KEY("role_id","permission_key")
);
--> statement-breakpoint
CREATE TABLE "roles"."roles" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"level" text DEFAULT 'Custom' NOT NULL,
	"department" text,
	"color" text,
	"icon" text,
	"is_staff" boolean DEFAULT true NOT NULL,
	"is_premade" boolean DEFAULT false NOT NULL,
	"reports_to_role_id" text,
	"home_tiles" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"rules" jsonb DEFAULT '{"approvalLimits":[],"extraRules":[]}'::jsonb NOT NULL,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "roles_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "roles"."user_roles" (
	"user_id" text NOT NULL,
	"role_id" text NOT NULL,
	"starts_at" timestamp with time zone,
	"ends_at" timestamp with time zone,
	"assigned_by" text,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_roles_user_id_role_id_pk" PRIMARY KEY("user_id","role_id")
);
--> statement-breakpoint
ALTER TABLE "roles"."role_includes" ADD CONSTRAINT "role_includes_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "roles"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles"."role_includes" ADD CONSTRAINT "role_includes_included_role_id_roles_id_fk" FOREIGN KEY ("included_role_id") REFERENCES "roles"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles"."role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "roles"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles"."user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "roles"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "role_permissions_key_idx" ON "roles"."role_permissions" USING btree ("permission_key");--> statement-breakpoint
CREATE INDEX "user_roles_role_idx" ON "roles"."user_roles" USING btree ("role_id");