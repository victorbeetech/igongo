/** `GuestContentStore` on the module's settings table (key `content`). */

import { ModuleSettings, type Database } from "@igongo/core";
import type { GuestContentStore } from "../../application/ports/guest-content-store";
import { EMPTY_GUEST_CONTENT, type GuestContent } from "../../domain/content";
import { settings } from "./schema";

/** The settings key the document is saved under. */
const KEY = "content";

export class SettingsGuestContentStore implements GuestContentStore {
  private readonly store: ModuleSettings;

  constructor(db: Database) {
    this.store = new ModuleSettings(db, settings);
  }

  /** Reads the document; any list not saved yet is empty. */
  read(): Promise<GuestContent> {
    return this.store.read(KEY, EMPTY_GUEST_CONTENT);
  }

  /** Writes the whole document. */
  write(content: GuestContent, by: string | null, now: Date): Promise<void> {
    return this.store.write(KEY, content, by, now);
  }
}
