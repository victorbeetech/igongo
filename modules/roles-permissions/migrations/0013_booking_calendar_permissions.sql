-- The booking calendar's settings (on/off, opening days, full rule, window)
-- are changed by the super admin. Granted to the super admin role through the
-- roles tables, like every other role permission, so the super admin can change
-- the role later in the app. ON CONFLICT DO NOTHING keeps any change already made.
--> statement-breakpoint
INSERT INTO "roles"."role_permissions" ("role_id","permission_key","scope") SELECT r."id", 'booking-calendar.settings.view', 'all' FROM "roles"."roles" r WHERE r."id" = 'role_super-admin' ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO "roles"."role_permissions" ("role_id","permission_key","scope") SELECT r."id", 'booking-calendar.settings.edit', 'all' FROM "roles"."roles" r WHERE r."id" = 'role_super-admin' ON CONFLICT DO NOTHING;
