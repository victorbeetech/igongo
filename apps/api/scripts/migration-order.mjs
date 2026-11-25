// The order module migrations are applied in. Core modules first, because
// later modules may record to the Audit Trail and check roles.
// Used by the tests, `pnpm db:migrations` and the deploy steps.

import { readdirSync } from "node:fs";
import { join } from "node:path";

/** Modules with a database schema, in apply order. */
export const MODULES = ["audit-trail", "roles-permissions", "users-login", "super-admin", "notifications"];

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
