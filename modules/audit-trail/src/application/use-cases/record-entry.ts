/**
 * Use case: record one action. Every module calls this through the
 * `AuditRecorder` contract. If it throws, the caller must refuse the action
 * (spec: "the action is refused rather than done without a record").
 */

import type { AuditEntryInput, AuditRecorder } from "@igongo/contracts/audit-trail";
import { AppError, newId } from "@igongo/core";
import type { AuditStore } from "../ports/audit-store";

/** Words that must never be stored as changed values. */
const SECRET_FIELDS = /password|secret|token|pin|otp|code|key/i;

/** Makes the recorder that other modules are given. */
export function auditRecorder(store: AuditStore): AuditRecorder {
  return {
    async record(entry: AuditEntryInput) {
      // 1. Refuse empty records: an action and module are always needed.
      if (!entry.action || !entry.module || !entry.summary) {
        throw new AppError("bad_request", "An audit entry needs an action, a module and a summary.");
      }
      // 2. Mask any secret-looking field so no key or password lands in the log.
      const changes = entry.changes ? maskSecrets(entry.changes) : undefined;
      // 3. Append; the database adds the time, sequence and hashes.
      await store.append({ ...entry, ...(changes ? { changes } : {}), id: newId("aud") });
    },
  };
}

/** Replaces the values of secret-looking fields with "••••". */
function maskSecrets(changes: NonNullable<AuditEntryInput["changes"]>) {
  return Object.fromEntries(
    Object.entries(changes).map(([field, change]) =>
      SECRET_FIELDS.test(field) ? [field, { old: change.old == null ? null : "••••", new: change.new == null ? null : "••••" }] : [field, change],
    ),
  );
}
