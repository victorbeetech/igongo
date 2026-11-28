-- Guest content (banners, stories, featured stays, did-you-know cards and
-- restaurant slides): the super admin can view and edit everything the guest
-- app shows, without code. Other roles get these keys from the super admin screens.
--> statement-breakpoint
INSERT INTO "roles"."role_permissions" ("role_id","permission_key","scope") SELECT r."id", p.key, 'all' FROM "roles"."roles" r CROSS JOIN (VALUES ('guest-content.content.edit'), ('guest-content.content.view')) AS p(key) WHERE r."id" = 'role_super-admin' ON CONFLICT DO NOTHING;
