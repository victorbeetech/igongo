-- The super admin posts updates and notifications from the web portal, which
-- calls POST /api/notifications/push/broadcast (needs notifications.broadcast.send)
-- and sends a test push (needs notifications.push.test). Migration 0010 granted
-- the super admin every key the modules defined then, and these two were not in
-- that list, so the super admin got "permission_denied". Grants them now.
-- ON CONFLICT DO NOTHING keeps any change already made in the app.
INSERT INTO "roles"."role_permissions" ("role_id","permission_key","scope") VALUES
('role_super-admin','notifications.broadcast.send','all'),
('role_super-admin','notifications.push.test','all')
ON CONFLICT DO NOTHING;
