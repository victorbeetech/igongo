/**
 * Records Archive & Search HTTP routes, mounted by the gateway at `/api/records`.
 *
 *   GET  /records/search                       find records (words, person, module, dates)  S06-01
 *   GET  /records/history/:recordType/:id      everything that happened to one record       S06-02
 *   GET  /records/export.csv                   the search as a spreadsheet                  S06-04
 */

import { zValidator } from "@hono/zod-validator";
import { requireStaffPermission, type ActorEnv } from "@igongo/core";
import { Hono, type Context } from "hono";
import type { RecordsDeps } from "../application/records-deps";
import { exportRecords } from "../application/use-cases/export-records";
import { RECORDS_PERMISSIONS as P } from "./permissions";
import { searchQuery } from "./request-schemas";
import { toAuditQuery } from "./to-audit-query";

export function recordsRouter(deps: (c: Context<ActorEnv>) => RecordsDeps) {
  return new Hono<ActorEnv>()
    .get("/search", requireStaffPermission(P.view), zValidator("query", searchQuery), async (c) => c.json(await deps(c).trail.search(toAuditQuery(c.req.valid("query")))))
    .get("/history/:recordType/:id", requireStaffPermission(P.view), async (c) => {
      // Oldest first reads like a story.
      const page = await deps(c).trail.search({ recordType: c.req.param("recordType"), recordId: c.req.param("id"), limit: 200 });
      return c.json({ items: page.items.reverse() });
    })
    .get("/export.csv", requireStaffPermission(P.export), zValidator("query", searchQuery), async (c) => {
      const q = toAuditQuery(c.req.valid("query"));
      const { csv } = await exportRecords(deps(c), q);
      return c.body(csv, 200, { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="records.csv"` });
    });
}
