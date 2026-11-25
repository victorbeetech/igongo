/**
 * Notification rules from a fixed list. Used until the rule editor saves
 * rules in this module's tables (Phase 7), and in tests.
 */

import type { RuleSource } from "../../application/ports/rule-source";
import type { NotificationRule } from "../../domain/notification-rule";

/** `RuleSource` from an array. */
export class MemoryRuleSource implements RuleSource {
  constructor(private readonly rules: NotificationRule[] = []) {}

  async enabledRulesFor(event: string): Promise<NotificationRule[]> {
    return this.rules.filter((rule) => rule.enabled && rule.event === event);
  }
}
