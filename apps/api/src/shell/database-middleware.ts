/**
 * Puts the request's database on `c.var.db`, and closes it afterwards.
 *
 * Requests that change data (anything but GET, HEAD and OPTIONS) run inside
 * ONE transaction, so a change and its Audit Trail entry are saved together
 * or not at all. A reply of 400 or more rolls everything back.
 *
 * Better Auth's routes are the exception: a failed sign-in must still save
 * its audit entry and rate-limit count, so they are not wrapped.
 */

import type { MiddlewareHandler } from "hono";
import type { Database } from "@igongo/core";
import type { ApiEnv } from "./api-env";
import type { DatabaseProvider } from "./database";

/** Thrown inside the transaction only to roll it back. */
class Rollback extends Error {}

/** Reading methods never need a transaction. */
const READS = new Set(["GET", "HEAD", "OPTIONS"]);

export function databaseMiddleware(provider: DatabaseProvider, authBasePath: string): MiddlewareHandler<ApiEnv> {
  return async (c, next) => {
    const open = provider(c.env);
    try {
      if (READS.has(c.req.method) || c.req.path.startsWith(authBasePath)) {
        c.set("db", open.db);
        await next();
        return;
      }
      await open.db
        .transaction(async (tx) => {
          c.set("db", tx as unknown as Database);
          await next();
          // Errors are already turned into replies here, so check the status.
          if (c.error || c.res.status >= 400) throw new Rollback();
        })
        .catch((error: unknown) => {
          if (!(error instanceof Rollback)) throw error;
        });
    } finally {
      // Close after the reply is sent, without delaying it.
      const closing = open.close();
      try {
        c.executionCtx.waitUntil(closing);
      } catch {
        await closing;
      }
    }
  };
}
