/**
 * A bonus (S31-01): cash, paid with the next pay run, or buffet access, a
 * number of buffet passes used by tapping the staff card at the buffet.
 * Its life: `pending` (when the super admin wants approvals), `approved`,
 * or `declined`; cash bonuses end `paid`, buffet bonuses `used` up.
 */

export const BONUS_KINDS = ["cash", "buffet"] as const;
export type BonusKind = (typeof BONUS_KINDS)[number];

export const BONUS_STATUSES = ["pending", "approved", "declined", "paid", "used"] as const;
export type BonusStatus = (typeof BONUS_STATUSES)[number];

export interface Bonus {
  id: string;
  staffId: string;
  staffName: string;
  department: string | null;
  kind: BonusKind;
  /** Cash amount in UGX, 0 for buffet. */
  amount: number;
  /** Buffet passes given and used, 0 for cash. */
  passes: number;
  passesUsed: number;
  /** The last day passes may be used, `YYYY-MM-DD`, or null for cash. */
  validUntil: string | null;
  reason: string;
  status: BonusStatus;
  awardedByName: string;
  decidedByName: string | null;
  decidedAt: Date | null;
  /** The pay run that paid a cash bonus. */
  payRunId: string | null;
  paidAt: Date | null;
  createdAt: Date;
}

/** True when [bonus] still has a buffet pass to use on [today]. */
export const hasPassFor = (bonus: Bonus, today: string) => bonus.kind === "buffet" && bonus.status === "approved" && bonus.passesUsed < bonus.passes && (bonus.validUntil ?? "") >= today;
