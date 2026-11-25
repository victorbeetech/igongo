/**
 * Builds the API: the shell middleware in order, then the module routes.
 * `index.ts` adds Sentry around it; tests call `createApp` with PGlite.
 *
 * Order matters:
 *   1. request ID   2. CORS   3. database (transaction for changes)
 *   4. services     5. who is calling   6. routes
 */

import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { AUTH_BASE_PATH } from "@igongo/users-login";
import type { ApiEnv } from "./shell/api-env";
import { corsFor } from "./shell/cors";
import type { DatabaseProvider } from "./shell/database";
import { databaseMiddleware } from "./shell/database-middleware";
import { readConfig } from "./shell/env";
import { errorHandler, notFound, type ErrorReporter } from "./shell/error-handler";
import { healthRoute } from "./shell/health-route";
import { requestId } from "./shell/request-id";
import { actorMiddleware } from "./wiring/actor-middleware";
import { RequestServices } from "./wiring/request-services";
import { mountRoutes } from "./wiring/routes";

export function createApp(database: DatabaseProvider, report: ErrorReporter = () => {}) {
  const app = new Hono<ApiEnv>();
  app.onError(errorHandler(report));
  app.notFound(notFound);
  app.use(requestId);
  app.use(secureHeaders());
  app.use("*", async (c, next) => corsFor(readConfig(c.env).webOrigins)(c, next));
  // A friendly answer at the root, without touching the database.
  app.get("/", (c) => c.json({ name: "Igongo API", health: "/health" }));
  app.use(databaseMiddleware(database, AUTH_BASE_PATH));
  app.use(async (c, next) => {
    c.set("services", new RequestServices(c.var.db, c.env, c.var.requestId));
    await next();
  });
  app.route("/health", healthRoute);
  app.use("/api/*", actorMiddleware);
  mountRoutes(app);
  return app;
}
