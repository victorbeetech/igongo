/** Money taken back on an advance: by a pay run, or in cash. */

export interface Repayment {
  id: string;
  advanceId: string;
  /** The pay month, `YYYY-MM`. */
  period: string;
  amount: number;
  /** The pay run that took it, or null for a cash repayment. */
  payRunId: string | null;
  byName: string;
  at: Date;
}
