// drizzle-kit settings: writes the SQL migrations for this module's own
// `notifications` Postgres schema into ./migrations (`pnpm db:generate`).
// Migrations are applied by the deploy pipeline (Phase 5), never by hand.

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/infrastructure/db/schema.ts",
  out: "./migrations",
  schemaFilter: ["notifications"],
});
