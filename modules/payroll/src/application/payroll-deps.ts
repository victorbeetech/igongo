/** Everything Payroll's use cases need, given by the gateway per request. */

import type { AdvanceRecovery } from "@igongo/contracts/advances-loans";
import type { CashBonusSource } from "@igongo/contracts/bonuses-rewards";
import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext } from "@igongo/core";
import type { PayrollRepository } from "./ports/payroll-repository";
import type { PayrollSettingsStore } from "./ports/settings-store";

export interface PayrollDeps {
  payroll: PayrollRepository;
  settings: PayrollSettingsStore;
  staff: StaffDirectory;
  /** Cash bonuses to add to pay; null while Bonuses & Rewards is off. */
  bonuses: CashBonusSource | null;
  /** Advance instalments to take; null while Advances & Loans is off. */
  advances: AdvanceRecovery | null;
  change: ChangeContext;
}
