/** `RulesStore` on the module's settings table (key `rules`). */

import { ModuleSettings, type Database } from "@igongo/core";
import type { RulesStore } from "../../application/ports/rules-store";
import { DEFAULT_RULES, type AttendanceRules } from "../../domain/attendance-rules";
import { settings } from "./schema";

export class SettingsRulesStore implements RulesStore {
  private readonly store: ModuleSettings;

  constructor(db: Database) {
    this.store = new ModuleSettings(db, settings);
  }

  read(): Promise<AttendanceRules> {
    return this.store.read("rules", DEFAULT_RULES);
  }

  write(rules: AttendanceRules, by: string | null, now: Date): Promise<void> {
    return this.store.write("rules", rules, by, now);
  }
}
