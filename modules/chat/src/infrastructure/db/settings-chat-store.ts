/** `ChatSettingsStore` on the module's settings table (key `settings`). */

import { ModuleSettings, type Database } from "@igongo/core";
import type { ChatSettingsStore } from "../../application/ports/settings-store";
import { DEFAULT_CHAT_SETTINGS, type ChatSettings } from "../../domain/chat-settings";
import { settings } from "./schema";

export class SettingsChatStore implements ChatSettingsStore {
  private readonly store: ModuleSettings;

  constructor(db: Database) {
    this.store = new ModuleSettings(db, settings);
  }

  read(): Promise<ChatSettings> {
    return this.store.read("settings", DEFAULT_CHAT_SETTINGS);
  }

  write(value: ChatSettings, by: string | null, now: Date): Promise<void> {
    return this.store.write("settings", value, by, now);
  }
}
