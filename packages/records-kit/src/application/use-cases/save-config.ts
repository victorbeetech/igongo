/**
 * Saving a module's set-up from the settings screen. Checks keys are unique
 * and every type keeps at least one status, so no record is ever stranded.
 * Removing a field or status never touches old records: they keep their
 * saved values, and an unknown status shows by its key.
 */

import { AppError, recordChange } from "@igongo/core";
import type { RecordConfig } from "../../domain/record-config";
import type { RecordsDeps } from "../records-deps";

/** True when [keys] has no repeats. */
const unique = (keys: string[]) => new Set(keys).size === keys.length;

export async function saveConfig(deps: RecordsDeps, config: RecordConfig): Promise<RecordConfig> {
  if (!unique(config.types.map((t) => t.key))) throw new AppError("bad_request", "Two record types have the same key.");
  for (const t of config.types) {
    if (t.statuses.length === 0) throw new AppError("bad_request", `${t.name} needs at least one status.`);
    if (!unique(t.fields.map((f) => f.key))) throw new AppError("bad_request", `${t.name} has two fields with the same key.`);
    if (!unique(t.statuses.map((s) => s.key))) throw new AppError("bad_request", `${t.name} has two statuses with the same key.`);
  }
  await deps.config.write(config, deps.change.actorId, deps.change.now);
  await recordChange(deps.change, { module: deps.module.key, action: "records.settings_changed", recordType: "settings", recordId: "config", summary: `${config.types.length} record types: ${config.types.map((t) => `${t.name} (${t.fields.length} fields, ${t.statuses.length} statuses)`).join("; ")}` });
  return config;
}
