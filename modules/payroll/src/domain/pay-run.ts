/**
 * A pay run (S28-02): one month's pay for everyone with an active profile.
 * Its life: `draft` (recalculate and adjust freely), `approved` (locked),
 * `paid` (bonuses and advance instalments are then marked as settled), or
 * `cancelled`.
 */

export const RUN_STATUSES = ["draft", "approved", "paid", "cancelled"] as const;
export type RunStatus = (typeof RUN_STATUSES)[number];

export interface PayRun {
  id: string;
  /** The pay month, `YYYY-MM`. */
  period: string;
  status: RunStatus;
  staffCount: number;
  gross: number;
  deductions: number;
  net: number;
  /** What the hotel pays on top (such as its NSSF share). */
  employerCost: number;
  createdById: string;
  createdByName: string;
  createdAt: Date;
  approvedByName: string | null;
  approvedAt: Date | null;
  paidByName: string | null;
  paidAt: Date | null;
}
