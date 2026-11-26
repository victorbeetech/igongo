/** `BonusRulesStore` on the module's settings table (key `rules`). */

import { ModuleSettings, type Database } from "@igongo/core";
import type { BonusRulesStore } from "../../application/ports/rules-store";
import { DEFAULT_BONUS_RULES, type BonusRules } from "../../domain/bonus-rules";
import { settings } from "./schema";

export class SettingsBonusRulesStore implements BonusRulesStore {
  private readonly store: ModuleSettings;

  constructor(db: Database) {
    this.store = new ModuleSettings(db, settings);
  }

  read(): Promise<BonusRules> {
    return this.store.read("rules", DEFAULT_BONUS_RULES);
  }

  write(value: BonusRules, by: string | null, now: Date): Promise<void> {
    return this.store.write("rules", value, by, now);
  }
}
