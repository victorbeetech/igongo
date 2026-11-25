/**
 * What every changing use case needs besides its input: who is changing
 * things, the Audit Trail recorder, the clock and the request ID. Shared so
 * every module records changes the same way.
 */

import type { AuditEntryInput, AuditRecorder } from "@igongo/contracts/audit-trail";

export interface ChangeContext {
  actorId: string | null;
  actorName?: string;
  audit: AuditRecorder;
  now: Date;
  requestId?: string;
}

/** The parts of an entry a use case fills in; the rest comes from [ctx]. */
export type ChangeEntry = Omit<AuditEntryInput, "actorId" | "actorName" | "context">;

/**
 * Records one change with the caller's details. If it throws, the use case
 * must stop: no change without a record (Audit Trail spec).
 */
export function recordChange(ctx: ChangeContext, entry: ChangeEntry): Promise<void> {
  return ctx.audit.record({
    actorId: ctx.actorId,
    ...(ctx.actorName ? { actorName: ctx.actorName } : {}),
    ...entry,
    ...(ctx.requestId ? { context: { requestId: ctx.requestId } } : {}),
  });
}
