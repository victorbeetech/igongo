/** Where the board-wide switches are kept. */

import type { BoardSettings } from "../../domain/board-settings";

export interface BoardSettingsStore {
  read(): Promise<BoardSettings>;
  write(settings: BoardSettings, by: string | null, now: Date): Promise<void>;
}
