/** Where the module's switches are kept. */

import type { InspectionSettings } from "../../domain/inspection-settings";

export interface InspectionSettingsStore {
  read(): Promise<InspectionSettings>;
  write(settings: InspectionSettings, by: string | null, now: Date): Promise<void>;
}
