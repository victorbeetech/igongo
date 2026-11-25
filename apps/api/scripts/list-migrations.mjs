// Prints the migration files in apply order (`pnpm db:migrations`).
// Applied migrations are recorded in public.igongo_migrations, so compare
// with `select module, name from public.igongo_migrations` to see what is new.

import { fileURLToPath } from "node:url";
import { migrationFiles } from "./migration-order.mjs";

const root = fileURLToPath(new URL("../../..", import.meta.url));
for (const m of migrationFiles(root)) process.stdout.write(`${m.module}/${m.name}\n`);
