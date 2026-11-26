/**
 * Everything Records Archive & Search needs, given by the gateway per
 * request. It keeps no tables: every module records what it did in the
 * Audit Trail, so the trail is the permanent, searchable record of
 * "who did what, when", years back.
 */

import type { AuditReader } from "@igongo/contracts/audit-trail";
import type { ChangeContext } from "@igongo/core";

export interface RecordsDeps {
  trail: AuditReader;
  change: ChangeContext;
}
