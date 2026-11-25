/**
 * Port: the notification rules the super admin builds. Stored in this
 * module's own tables when the rule editor is connected (Phase 7).
 */

import type { NotificationRule } from "../../domain/notification-rule";

/** Reads notification rules. */
export interface RuleSource {
  /** Every switched-on rule for [event]. */
  enabledRulesFor(event: string): Promise<NotificationRule[]>;
}
