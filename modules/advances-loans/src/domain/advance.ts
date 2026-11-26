/**
 * A salary advance or a staff loan (S30-01). Its life: `requested` by the
 * staff member, `approved` or `declined` by a manager (or `cancelled` by the
 * staff member first), `disbursed` when the money is handed over, and
 * `repaid` once payroll (or a cash repayment) has taken it all back.
 */

export const ADVANCE_KINDS = ["advance", "loan"] as const;
export type AdvanceKind = (typeof ADVANCE_KINDS)[number];

export const ADVANCE_STATUSES = ["requested", "approved", "declined", "cancelled", "disbursed", "repaid"] as const;
export type AdvanceStatus = (typeof ADVANCE_STATUSES)[number];

export interface Advance {
  id: string;
  /** Such as `ADV-0007`. */
  number: string;
  staffId: string;
  staffName: string;
  department: string | null;
  kind: AdvanceKind;
  /** Whole Uganda shillings. */
  amount: number;
  reason: string;
  /** How many monthly instalments payroll takes. */
  instalments: number;
  instalmentAmount: number;
  /** The first pay month that takes an instalment, `YYYY-MM`. */
  startPeriod: string;
  status: AdvanceStatus;
  /** Taken back so far. */
  repaid: number;
  requestedAt: Date;
  decidedByName: string | null;
  decidedAt: Date | null;
  decisionNote: string | null;
  disbursedByName: string | null;
  disbursedAt: Date | null;
}

/** Each instalment, rounded up so the last one is never larger. */
export const instalmentOf = (amount: number, instalments: number) => Math.ceil(amount / Math.max(1, instalments));

/** What is still owed. */
export const balanceOf = (a: Pick<Advance, "amount" | "repaid">) => Math.max(0, a.amount - a.repaid);

/** True while it still counts against the person (asked, approved or being repaid). */
export const isOpenAdvance = (a: Pick<Advance, "status">) => a.status === "requested" || a.status === "approved" || a.status === "disbursed";
