/**
 * The Audit Trail's HTTP routes, mounted by the gateway at `/audit`.
 * There is no route to change or delete an entry, by design.
 *
 *   GET /audit/entries   search (filters in the query string), newest first
 *   GET /audit/verify    check the hash chain for tampering
 */

import { zValidator } from "@hono/zod-validator";
import { Hono, type Context } from "hono";
import { requirePermission, type ActorEnv } from "@igongo/core";
import type { AuditStore } from "../application/ports/audit-store";
import { searchEntries } from "../application/use-cases/search-entries";
import { verifyChain } from "../application/use-cases/verify-chain";
import { AUDIT_PERMISSIONS } from "./permissions";
import { searchQuery, verifyQuery } from "./request-schemas";

/** Builds the router. [store] is called per request for its own DB connection. */
export function auditRouter(store: (c: Context<ActorEnv>) => AuditStore) {
  return new Hono<ActorEnv>()
    .get("/entries", requirePermission(AUDIT_PERMISSIONS.view), zValidator("query", searchQuery), async (c) => {
      const { q, ...rest } = c.req.valid("query");
      return c.json(await searchEntries(store(c), { ...rest, ...(q ? { text: q } : {}) }));
    })
    .get("/verify", requirePermission(AUDIT_PERMISSIONS.verify), zValidator("query", verifyQuery), async (c) => {
      const { fromSeq, limit } = c.req.valid("query");
      return c.json(await verifyChain(store(c), fromSeq, limit));
    });
}
