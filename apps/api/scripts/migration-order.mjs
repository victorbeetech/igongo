// The order module migrations are applied in. Core modules first, because
// later modules may record to the Audit Trail and check roles.
// Used by the tests, `pnpm db:migrations` and the deploy steps.

import { readdirSync } from "node:fs";
import { join } from "node:path";

/** Modules with a database schema, in apply order. */
export const MODULES = [
  // Core platform.
  "audit-trail",
  "roles-permissions",
  "users-login",
  "super-admin",
  "notifications",
  // Staff (build step 2): each has its own schema and never reads another's tables.
  "hr-records",
  "staff-cards",
  "wristbands",
  "attendance",
  "daily-reports",
  "staff-meals",
  "notice-board",
  // Guests and riders (build step 3).
  "crm-guests",
  "menu-catalogue",
  "food-ordering",
  "delivery-riders",
  "payments",
  "room-bookings",
  "museum",
  "events-conferences",
  "pool",
  "crafts-bookshop",
];

/** Every migration file as { module, name, path }, in apply order. */
export function migrationFiles(repoRoot) {
  return MODULES.flatMap((module) => {
    const dir = join(repoRoot, "modules", module, "migrations");
    return readdirSync(dir)
      .filter((f) => f.endsWith(".sql"))
      .sort()
      .map((name) => ({ module, name, path: join(dir, name) }));
  });
}
