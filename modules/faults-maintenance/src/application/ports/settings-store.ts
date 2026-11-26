/** Where the module's settings are kept. */

import type { FaultSettings } from "../../domain/fault-settings";

export interface FaultSettingsStore {
  read(): Promise<FaultSettings>;
  write(settings: FaultSettings, by: string | null, now: Date): Promise<void>;
}
