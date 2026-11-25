/** `MealRulesStore` on the module's settings table (key `rules`). */

import { ModuleSettings, type Database } from "@igongo/core";
import type { MealRulesStore } from "../../application/ports/meal-rules-store";
import { DEFAULT_MEAL_RULES, type MealRules } from "../../domain/meal-rules";
import { settings } from "./schema";

export class SettingsMealRulesStore implements MealRulesStore {
  private readonly store: ModuleSettings;

  constructor(db: Database) {
    this.store = new ModuleSettings(db, settings);
  }

  read(): Promise<MealRules> {
    return this.store.read("rules", DEFAULT_MEAL_RULES);
  }

  write(rules: MealRules, by: string | null, now: Date): Promise<void> {
    return this.store.write("rules", rules, by, now);
  }
}
