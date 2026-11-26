/** Builds one records module's dependencies on its own tables. Used by each module's index. */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import type { RecordModule } from "../application/record-module";
import type { RecordsDeps } from "../application/records-deps";
import { DrizzleRecordRepository } from "./db/drizzle-record-repository";
import type { RecordTables } from "./db/record-tables";
import { SettingsConfigStore } from "./db/settings-config-store";

export function recordsDeps(module: RecordModule, tables: RecordTables, db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps {
  return { module, records: new DrizzleRecordRepository(db, tables), config: new SettingsConfigStore(db, tables, module.defaults), staff, change };
}
