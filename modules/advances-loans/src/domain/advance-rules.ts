/**
 * The super admin's rules for advances and loans (S30-05). A limit of 0
 * means no limit.
 */

import type { AdvanceKind } from "./advance";

export interface KindRule {
  enabled: boolean;
  /** The most one person may ask for, UGX; 0 for no limit. */
  maxAmount: number;
  maxInstalments: number;
}

export interface AdvanceRules {
  advance: KindRule;
  loan: KindRule;
  /** Only one open advance or loan per person at a time. */
  oneOpenAtATime: boolean;
}

export const DEFAULT_ADVANCE_RULES: AdvanceRules = {
  advance: { enabled: true, maxAmount: 0, maxInstalments: 1 },
  loan: { enabled: false, maxAmount: 0, maxInstalments: 12 },
  oneOpenAtATime: true,
};

/** Why a request breaks [rules], or null when it is fine. */
export function requestBreak(rules: AdvanceRules, req: { kind: AdvanceKind; amount: number; instalments: number }, openCount: number): string | null {
  const rule = rules[req.kind];
  if (!rule.enabled) return req.kind === "loan" ? "Staff loans are switched off." : "Salary advances are switched off.";
  if (rule.maxAmount > 0 && req.amount > rule.maxAmount) return `The most you can ask for is ${rule.maxAmount} UGX.`;
  if (req.instalments > rule.maxInstalments) return `Pay it back in at most ${rule.maxInstalments} months.`;
  if (rules.oneOpenAtATime && openCount > 0) return "You already have an open advance or loan.";
  return null;
}
