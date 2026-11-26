/** `RulesStore` on the module's settings table (key `rules`). */

import { ModuleSettings, type Database } from "@igongo/core";
import type { RulesStore } from "../../application/ports/rules-store";
import { DEFAULT_ORDERING_RULES, type OrderingRules } from "../../domain/ordering-rules";
import { settings } from "./schema";

export class SettingsRulesStore implements RulesStore {
  private readonly store: ModuleSettings;

  constructor(db: Database) {
    this.store = new ModuleSettings(db, settings);
  }

  async read(): Promise<OrderingRules> {
    const saved = await this.store.read("rules", DEFAULT_ORDERING_RULES);
    return { ...saved, types: { ...DEFAULT_ORDERING_RULES.types, ...saved.types } };
  }

  write(rules: OrderingRules, by: string | null, now: Date): Promise<void> {
    return this.store.write("rules", rules, by, now);
  }
}
