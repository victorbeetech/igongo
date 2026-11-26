/** Everything Faults & Maintenance's use cases need, given by the gateway per request. */

import type { FileDirectory } from "@igongo/contracts/files-media";
import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext } from "@igongo/core";
import type { FaultRepository } from "./ports/fault-repository";
import type { FaultSettingsStore } from "./ports/settings-store";

export interface FaultsDeps {
  faults: FaultRepository;
  settings: FaultSettingsStore;
  staff: StaffDirectory;
  /** Checks photo IDs (Files & Media). */
  files: FileDirectory;
  change: ChangeContext;
}
