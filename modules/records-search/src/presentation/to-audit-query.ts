/** Turns the search query string into the Audit Trail's filters. */

import type { AuditQuery } from "@igongo/contracts/audit-trail";
import type { z } from "zod";
import type { searchQuery } from "./request-schemas";

export function toAuditQuery(q: z.infer<typeof searchQuery>): AuditQuery {
  return {
    limit: q.limit,
    ...(q.q ? { text: q.q } : {}),
    ...(q.person ? { actorId: q.person } : {}),
    ...(q.module ? { module: q.module } : {}),
    ...(q.action ? { action: q.action } : {}),
    ...(q.from ? { from: q.from } : {}),
    ...(q.to ? { to: q.to } : {}),
    ...(q.beforeSeq ? { beforeSeq: q.beforeSeq } : {}),
  };
}
