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
import { runScheduledReports } from "./shell/run-scheduled-reports";
import { createLogger } from "@igongo/core";

/** The daily cron, 04:00 UTC = 7 AM in Kampala; kept on in wrangler.jsonc. */
const DAILY_CRON = "0 4 * * *";

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
    // Cron. Every run applies new database migrations (see
    // migrations/run-migrations.ts); the daily 7 AM Kampala run
    // (DAILY_CRON) also runs the scheduled saved reports.
    async scheduled(event, env, ctx) {
      const open = postgresProvider(env);
      try {
        const report = await runMigrations(open.db, MIGRATIONS);
        createLogger({ job: "migrations" }).log(report.changedAfterApply.length ? "warn" : "info", "Migrations run", { ...report });
        if (event.cron === DAILY_CRON) {
          const reports = await runScheduledReports(open.db, env, new Date(event.scheduledTime));
          createLogger({ job: "saved-reports" }).log(reports !== "off" && reports.failed ? "warn" : "info", "Scheduled reports run", { result: reports });
        }
      } finally {
        ctx.waitUntil(open.close());
      }
    },
  } satisfies ExportedHandler<Env>,
);
