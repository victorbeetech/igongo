/** `RulesStore` on the module's settings table (key `rules`). */

import { ModuleSettings, type Database } from "@igongo/core";
import type { RulesStore } from "../../application/ports/rules-store";
import { DEFAULT_DELIVERY_RULES, type DeliveryRules } from "../../domain/delivery-rules";
import { settings } from "./schema";

export class SettingsDeliveryRulesStore implements RulesStore {
  private readonly store: ModuleSettings;

  constructor(db: Database) {
    this.store = new ModuleSettings(db, settings);
  }

  read(): Promise<DeliveryRules> {
    return this.store.read("rules", DEFAULT_DELIVERY_RULES);
  }

  write(rules: DeliveryRules, by: string | null, now: Date): Promise<void> {
    return this.store.write("rules", rules, by, now);
  }
}
