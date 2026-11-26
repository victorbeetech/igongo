/** Where the CRM options are kept. */

import type { CrmSettings } from "../../domain/crm-settings";

export interface CrmSettingsStore {
  read(): Promise<CrmSettings>;
  write(settings: CrmSettings, by: string | null, now: Date): Promise<void>;
}
