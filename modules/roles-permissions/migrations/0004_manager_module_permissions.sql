-- Build step 4 (managers and money): the super admin configures every new
--> statement-breakpoint
-- module (file limits, fault categories, checklists, payroll deductions,
--> statement-breakpoint
-- advance and bonus rules, dashboard tiles, chat desks). Daily work stays
--> statement-breakpoint
-- with the hotel's own roles. Buffet attendants serve buffet passes, and
--> statement-breakpoint
-- guests may chat with a hotel desk (their own chats only).
--> statement-breakpoint
-- WHERE EXISTS skips a deleted role; ON CONFLICT DO NOTHING keeps any change.
--> statement-breakpoint
INSERT INTO "roles"."role_permissions" ("role_id","permission_key","scope") SELECT r."id", p.key, 'all' FROM "roles"."roles" r CROSS JOIN (VALUES ('files-media.settings.edit'), ('faults-maintenance.settings.edit'), ('inspections.settings.edit'), ('inspections.checklists.edit'), ('inspections.runs.view'), ('payroll.settings.edit'), ('advances-loans.settings.edit'), ('advances-loans.requests.view'), ('bonuses-rewards.settings.edit'), ('bonuses-rewards.bonuses.view'), ('reports-analytics.settings.edit'), ('reports-analytics.dashboard.view'), ('chat.settings.edit'), ('chat.messages.view')) AS p(key) WHERE r."id" = 'role_super-admin' ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO "roles"."role_permissions" ("role_id","permission_key","scope") SELECT "id", 'bonuses-rewards.buffet.edit', 'all' FROM "roles"."roles" WHERE "id" IN ('role_buffet-attendant', 'role_canteen-attendant') ON CONFLICT DO NOTHING;
--> statement-breakpoint
INSERT INTO "roles"."role_permissions" ("role_id","permission_key","scope") SELECT r."id", p.key, 'own' FROM "roles"."roles" r CROSS JOIN (VALUES ('chat.messages.view'), ('chat.messages.create')) AS p(key) WHERE r."id" = 'role_guest' ON CONFLICT DO NOTHING;
--> statement-breakpoint
-- Everyone who sees HOD checkups may like and comment on them, in the same scope.
--> statement-breakpoint
INSERT INTO "roles"."role_permissions" ("role_id","permission_key","scope") SELECT rp."role_id", p.key, rp."scope" FROM "roles"."role_permissions" rp CROSS JOIN (VALUES ('inspections.runs.like'), ('inspections.runs.comment')) AS p(key) WHERE rp."permission_key" = 'inspections.*.view' ON CONFLICT DO NOTHING;
