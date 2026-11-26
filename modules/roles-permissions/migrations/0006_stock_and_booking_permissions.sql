-- Build step 5b (stock, spa, venues and tables): the super admin configures
--> statement-breakpoint
-- the spa, venue and table offerings and stock (stores, items, units, rules)
--> statement-breakpoint
-- and sees every booking and stock balance. Daily work stays with the hotel's
--> statement-breakpoint
-- own roles, which already hold each module's wildcard permissions.
--> statement-breakpoint
INSERT INTO "roles"."role_permissions" ("role_id","permission_key","scope") SELECT r."id", p.key, 'all' FROM "roles"."roles" r CROSS JOIN (VALUES ('spa.settings.edit'), ('spa.offerings.edit'), ('spa.bookings.view'), ('venues-equipment.settings.edit'), ('venues-equipment.offerings.edit'), ('venues-equipment.bookings.view'), ('tables-dinein.settings.edit'), ('tables-dinein.offerings.edit'), ('tables-dinein.bookings.view'), ('stock-inventory.settings.edit'), ('stock-inventory.stock.view'), ('stock-inventory.values.view'), ('stock-inventory.items.edit'), ('stock-inventory.stock.export'), ('stock-inventory.records.view'), ('stock-inventory.records.export')) AS p(key) WHERE r."id" = 'role_super-admin' ON CONFLICT DO NOTHING;
--> statement-breakpoint
-- Every staff member can raise and follow their own stock requisitions.
--> statement-breakpoint
INSERT INTO "roles"."role_permissions" ("role_id","permission_key","scope") SELECT r."id", p.key, 'own' FROM "roles"."roles" r CROSS JOIN (VALUES ('stock-inventory.records.view'), ('stock-inventory.records.create')) AS p(key) WHERE r."id" = 'role_staff-base' ON CONFLICT DO NOTHING;
