// drizzle-kit settings: writes the SQL migrations for this module's own
// `calendar` Postgres schema into ./migrations (`pnpm db:generate`).
// The API Worker applies them (apps/api/src/migrations), never by hand.

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/infrastructure/db/schema.ts",
  out: "./migrations",
  schemaFilter: ["calendar"],
});
