/** Where a module's record set-up (types, fields, statuses, switches) is saved. */

import type { RecordConfig } from "../../domain/record-config";

export interface RecordConfigStore {
  read(): Promise<RecordConfig>;
  write(config: RecordConfig, by: string | null, now: Date): Promise<void>;
}
