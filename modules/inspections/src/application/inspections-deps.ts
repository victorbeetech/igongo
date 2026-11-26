/** Everything Inspections' use cases need, given by the gateway per request. */

import type { FaultReporter } from "@igongo/contracts/faults-maintenance";
import type { FileDirectory } from "@igongo/contracts/files-media";
import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext } from "@igongo/core";
import type { InspectionRepository } from "./ports/inspection-repository";
import type { InspectionSettingsStore } from "./ports/settings-store";

export interface InspectionsDeps {
  inspections: InspectionRepository;
  settings: InspectionSettingsStore;
  staff: StaffDirectory;
  files: FileDirectory;
  /** Raises faults for failed checks; null while Faults & Maintenance is off. */
  faults: FaultReporter | null;
  change: ChangeContext;
}
