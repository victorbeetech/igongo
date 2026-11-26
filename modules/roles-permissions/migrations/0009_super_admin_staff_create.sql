-- The super admin enrols staff from the web (Add staff, S22-03), which needs
-- hr-records.staff.create. Granted here through the roles tables, like every
-- other role permission, so the super admin role can be changed in the app
-- later. ON CONFLICT DO NOTHING keeps any change the super admin already made.
--> statement-breakpoint
INSERT INTO "roles"."role_permissions" ("role_id","permission_key","scope") SELECT r."id", 'hr-records.staff.create', 'all' FROM "roles"."roles" r WHERE r."id" = 'role_super-admin' ON CONFLICT DO NOTHING;
