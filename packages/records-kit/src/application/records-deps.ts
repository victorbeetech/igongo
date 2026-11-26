/** Everything the kit's use cases need, given by the gateway per request for one module. */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext } from "@igongo/core";
import type { RecordConfigStore } from "./ports/config-store";
import type { RecordRepository } from "./ports/record-repository";
import type { RecordModule } from "./record-module";

export interface RecordsDeps {
  module: RecordModule;
  records: RecordRepository;
  config: RecordConfigStore;
  /** Finds the staff member a record is assigned to (HR Records), or null while HR is off. */
  staff: StaffDirectory | null;
  change: ChangeContext;
}
