/**
 * Everything Earnings Statements needs, given by the gateway per request.
 * It keeps no tables of its own: it reads Payroll, Bonuses and Advances
 * through their contracts. A module that is switched off is null and its
 * part of the statement is empty.
 */

import type { AdvanceHistory } from "@igongo/contracts/advances-loans";
import type { BonusHistory } from "@igongo/contracts/bonuses-rewards";
import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { PayHistory } from "@igongo/contracts/payroll";
import type { ChangeContext } from "@igongo/core";

export interface EarningsDeps {
  staff: StaffDirectory;
  pay: PayHistory | null;
  bonuses: BonusHistory | null;
  advances: AdvanceHistory | null;
  change: ChangeContext;
}
