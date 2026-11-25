/** `BoardSettingsStore` on the module's settings table (key `board`). */

import { ModuleSettings, type Database } from "@igongo/core";
import type { BoardSettingsStore } from "../../application/ports/board-settings-store";
import { DEFAULT_BOARD_SETTINGS, type BoardSettings } from "../../domain/board-settings";
import { settings } from "./schema";

export class SettingsBoardStore implements BoardSettingsStore {
  private readonly store: ModuleSettings;

  constructor(db: Database) {
    this.store = new ModuleSettings(db, settings);
  }

  read(): Promise<BoardSettings> {
    return this.store.read("board", DEFAULT_BOARD_SETTINGS);
  }

  write(value: BoardSettings, by: string | null, now: Date): Promise<void> {
    return this.store.write("board", value, by, now);
  }
}
