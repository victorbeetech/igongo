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
  // Managers and money (build step 4).
  "files-media",
  "faults-maintenance",
  "inspections",
  "advances-loans",
  "bonuses-rewards",
  "payroll",
  "reports-analytics",
  "chat",
  // Records-kit modules (build step 5), in module order.
  "forms-builder",
  "workflow-approvals",
  "data-import-export",
  "locations-departments",
  "devices-stations",
  "access-zones",
  "visitor-management",
  "key-control",
  "recruitment",
  "onboarding-exit",
  "shifts-rosters",
  "leave",
  "performance",
  "training",
  "discipline",
  "staff-welfare",
  "petty-cash",
  "asset-register",
  "tasks",
  "housekeeping",
  "laundry",
  "security-incidents",
  "lost-found",
  "fleet-transport",
  "knowledge-base",
  "meetings",
  "surveys-polls",
  "company-calendar",
  "corporate-accounts",
  "guest-feedback",
  "loyalty",
  "campaigns",
  "promotions-vouchers",
  "guest-requests",
  "kitchen-display",
  "buffet",
  "pricing-tax",
  "receipts-invoicing",
  "cash-up",
  "accounting-export",
  // Stock and the last booking modules.
  "stock-inventory",
  "spa",
  "venues-equipment",
  "tables-dinein",
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
