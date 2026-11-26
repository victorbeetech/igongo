/**
 * One line of the settlement report (S77-07): money in on one hotel day, by
 * one method, for one module and outlet. Finance ticks it against the bank,
 * MoMo and till statements.
 */

export interface SettlementRow {
  /** The hotel day the money came in, `YYYY-MM-DD`. */
  day: string;
  method: string;
  module: string;
  outlet: string | null;
  count: number;
  /** Whole Uganda shillings. */
  amount: number;
  refunded: number;
  /** amount minus refunded. */
  net: number;
}
