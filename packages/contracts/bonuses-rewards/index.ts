/**
 * Public contract of Bonuses & Rewards (module 31). Payroll adds approved
 * cash bonuses to pay through `CashBonusSource`; Earnings Statements reads a
 * person's bonuses (cash and buffet) through `BonusHistory`.
 */

/** An approved cash bonus not yet paid. */
export interface CashBonusDue {
  bonusId: string;
  staffId: string;
  amount: number;
  reason: string;
}

export interface CashBonusSource {
  /** Approved cash bonuses waiting for a pay run. */
  unpaid(): Promise<CashBonusDue[]>;
  /** Marks bonuses as paid in pay run [payRunId]. */
  paid(bonusIds: string[], payRunId: string, at: Date): Promise<void>;
}

/** One bonus in a person's history. */
export interface BonusSummary {
  bonusId: string;
  kind: "cash" | "buffet";
  /** Cash amount, or 0 for buffet. */
  amount: number;
  /** Buffet passes given and used, or 0 for cash. */
  passes: number;
  passesUsed: number;
  reason: string;
  status: string;
  createdAt: Date;
}

export interface BonusHistory {
  forStaff(staffId: string): Promise<BonusSummary[]>;
}
