/** Where the payroll settings are kept. */

import type { PayrollSettings } from "../../domain/payroll-settings";

export interface PayrollSettingsStore {
  read(): Promise<PayrollSettings>;
  write(settings: PayrollSettings, by: string | null, now: Date): Promise<void>;
}
