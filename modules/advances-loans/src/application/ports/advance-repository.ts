/** Where advances and their repayments are kept. */

import type { Advance, AdvanceStatus } from "../../domain/advance";
import type { Repayment } from "../../domain/repayment";

export interface AdvanceRepository {
  get(id: string): Promise<Advance | null>;
  list(filter: { staffId?: string; department?: string; status?: AdvanceStatus; limit: number }): Promise<Advance[]>;
  nextNumber(): Promise<string>;
  save(advance: Advance): Promise<void>;
  /** Adds a repayment row; false when this pay run already took this month's instalment. The caller updates the advance's total. */
  addRepayment(repayment: Repayment): Promise<boolean>;
  repayments(advanceId: string): Promise<Repayment[]>;
  /** Disbursed advances with money still owed, starting on or before [period]. */
  repaying(period: string): Promise<Advance[]>;
  /** True when a pay run already took an instalment of [advanceId] for [period]. */
  hasRepayment(advanceId: string, period: string): Promise<boolean>;
}
