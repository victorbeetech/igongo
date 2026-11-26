/** `AdvanceRulesStore` on the module's settings table (key `rules`). */

import { ModuleSettings, type Database } from "@igongo/core";
import type { AdvanceRulesStore } from "../../application/ports/rules-store";
import { DEFAULT_ADVANCE_RULES, type AdvanceRules } from "../../domain/advance-rules";
import { settings } from "./schema";

export class SettingsAdvanceRulesStore implements AdvanceRulesStore {
  private readonly store: ModuleSettings;

  constructor(db: Database) {
    this.store = new ModuleSettings(db, settings);
  }

  read(): Promise<AdvanceRules> {
    return this.store.read("rules", DEFAULT_ADVANCE_RULES);
  }

  write(value: AdvanceRules, by: string | null, now: Date): Promise<void> {
    return this.store.write("rules", value, by, now);
  }
}
