/** `DesignsStore` on the module's settings table (key `designs`). */

import { ModuleSettings, type Database } from "@igongo/core";
import type { DesignsStore } from "../../application/ports/designs-store";
import type { CardDesigns } from "../../domain/card-designs";
import { DEFAULT_CARD_DESIGNS } from "../../domain/default-designs";
import { settings } from "./schema";

export class SettingsDesignsStore implements DesignsStore {
  private readonly store: ModuleSettings;

  constructor(db: Database) {
    this.store = new ModuleSettings(db, settings);
  }

  read(): Promise<CardDesigns> {
    return this.store.read("designs", DEFAULT_CARD_DESIGNS);
  }

  write(value: CardDesigns, by: string | null, now: Date): Promise<void> {
    return this.store.write("designs", value, by, now);
  }
}
