-- The super admin deletes guest accounts from the web (Account detail). Needs
-- users-login.accounts.delete. Granted here through the roles tables, like every
-- other role permission, so the super admin role can be changed in the app
-- later. ON CONFLICT DO NOTHING keeps any change the super admin already made.
--> statement-breakpoint
INSERT INTO "roles"."role_permissions" ("role_id","permission_key","scope") SELECT r."id", 'users-login.accounts.delete', 'all' FROM "roles"."roles" r WHERE r."id" = 'role_super-admin' ON CONFLICT DO NOTHING;
