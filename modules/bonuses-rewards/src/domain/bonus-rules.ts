/** The super admin's rules for bonuses (S31-05). */

export interface BonusRules {
  cashEnabled: boolean;
  buffetEnabled: boolean;
  /** New bonuses wait for an approver. */
  requireApproval: boolean;
  /** How long buffet passes last, in days. */
  buffetValidDays: number;
  /** At most one buffet pass a day per person. */
  onePassPerDay: boolean;
  /** Reasons to pick from, such as "Employee of the month". */
  reasons: string[];
}

export const DEFAULT_BONUS_RULES: BonusRules = { cashEnabled: true, buffetEnabled: true, requireApproval: true, buffetValidDays: 30, onePassPerDay: true, reasons: [] };
