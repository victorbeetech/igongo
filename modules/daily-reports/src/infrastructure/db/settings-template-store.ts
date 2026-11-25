/** `TemplateStore` on the module's settings table (key `template`). */

import { ModuleSettings, type Database } from "@igongo/core";
import type { TemplateStore } from "../../application/ports/template-store";
import { DEFAULT_TEMPLATE, type ReportTemplate } from "../../domain/report-template";
import { settings } from "./schema";

export class SettingsTemplateStore implements TemplateStore {
  private readonly store: ModuleSettings;

  constructor(db: Database) {
    this.store = new ModuleSettings(db, settings);
  }

  read(): Promise<ReportTemplate> {
    return this.store.read("template", DEFAULT_TEMPLATE);
  }

  write(template: ReportTemplate, by: string | null, now: Date): Promise<void> {
    return this.store.write("template", template, by, now);
  }
}
