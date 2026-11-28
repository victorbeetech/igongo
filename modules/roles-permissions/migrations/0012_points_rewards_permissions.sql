-- Points rewards: the super admin can view and change the points rules,
-- run expiry and adjust a guest's points by hand, without code. Other roles
-- get these keys from the super admin screens.
--> statement-breakpoint
INSERT INTO "roles"."role_permissions" ("role_id","permission_key","scope") SELECT r."id", p.key, 'all' FROM "roles"."roles" r CROSS JOIN (VALUES ('points-rewards.rules.view'), ('points-rewards.rules.edit'), ('points-rewards.points.adjust')) AS p(key) WHERE r."id" = 'role_super-admin' ON CONFLICT DO NOTHING;
