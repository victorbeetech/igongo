// drizzle-kit settings: writes the SQL migrations for this module's own
// `users_login` Postgres schema into ./migrations (`pnpm db:generate`).
// Migrations are applied to Neon with `pnpm --filter @igongo/api db:migrate:sql`.

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/infrastructure/db/schema.ts",
  out: "./migrations",
  schemaFilter: ["users_login"],
});
