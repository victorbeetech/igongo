/** `FileRulesStore` on the module's settings table (key `rules`). */

import { ModuleSettings, type Database } from "@igongo/core";
import type { FileRulesStore } from "../../application/ports/rules-store";
import { DEFAULT_FILE_RULES, type FileRules } from "../../domain/file-rules";
import { settings } from "./schema";

export class SettingsFileRulesStore implements FileRulesStore {
  private readonly store: ModuleSettings;

  constructor(db: Database) {
    this.store = new ModuleSettings(db, settings);
  }

  read(): Promise<FileRules> {
    return this.store.read("rules", DEFAULT_FILE_RULES);
  }

  write(value: FileRules, by: string | null, now: Date): Promise<void> {
    return this.store.write("rules", value, by, now);
  }
}
