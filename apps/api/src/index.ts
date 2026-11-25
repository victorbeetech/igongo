/**
 * The Igongo API Worker's entry point. Wraps the app with Sentry, which
 * reports every unexpected error with its request ID and release.
 */

import * as Sentry from "@sentry/cloudflare";
import { createApp } from "./app";
import { MIGRATIONS } from "./migrations/migrations.g";
import { runMigrations } from "./migrations/run-migrations";
import { postgresProvider } from "./shell/database";
import { readConfig, type Env } from "./shell/env";
import { createLogger } from "@igongo/core";

const app = createApp(postgresProvider, (error, c) => {
  Sentry.withScope((scope) => {
    scope.setTag("request_id", c.get("requestId"));
    const actor = c.get("actor");
    if (actor) scope.setUser({ id: actor.userId });
    Sentry.captureException(error);
  });
});

export default Sentry.withSentry(
  (env: Env) => ({
    dsn: env.SENTRY_DSN,
    release: readConfig(env).release,
    environment: readConfig(env).environment,
    // A sample of requests is traced; every error is always sent.
    tracesSampleRate: 0.1,
  }),
  {
    fetch: app.fetch,
    // Cron: apply new database migrations (see migrations/run-migrations.ts).
    async scheduled(_event, env, ctx) {
      const open = postgresProvider(env);
      const report = await runMigrations(open.db, MIGRATIONS).finally(() => ctx.waitUntil(open.close()));
      createLogger({ job: "migrations" }).log(report.changedAfterApply.length ? "warn" : "info", "Migrations run", { ...report });
    },
  } satisfies ExportedHandler<Env>,
);
