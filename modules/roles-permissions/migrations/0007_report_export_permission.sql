-- Saved and scheduled reports: the super admin can download the dashboard
--> statement-breakpoint
-- and saved report runs as spreadsheets, like the managers already can.
--> statement-breakpoint
INSERT INTO "roles"."role_permissions" ("role_id","permission_key","scope") SELECT r."id", 'reports-analytics.dashboard.export', 'all' FROM "roles"."roles" r WHERE r."id" = 'role_super-admin' ON CONFLICT DO NOTHING;
