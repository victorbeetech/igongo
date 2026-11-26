/**
 * A staff member's pay profile (S28-01): basic monthly salary, fixed
 * allowances and how they are paid. Only payroll officers see it.
 */

import type { PayLine } from "@igongo/contracts/payroll";

export const PAY_METHODS = ["bank", "mobile_money", "cash"] as const;
export type PayMethod = (typeof PAY_METHODS)[number];

export interface PayProfile {
  staffId: string;
  /** Monthly, whole Uganda shillings. */
  basic: number;
  /** Fixed monthly allowances, such as transport or housing. */
  allowances: PayLine[];
  payMethod: PayMethod;
  /** The bank account or mobile money number. */
  account: string | null;
  /** Off profiles are left out of pay runs (unpaid leave, for example). */
  active: boolean;
  updatedAt: Date;
}
