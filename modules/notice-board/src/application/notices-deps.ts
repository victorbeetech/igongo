/** Everything the Notice Board's use cases need, given by the gateway per request. */

import type { ChangeContext } from "@igongo/core";
import type { BoardSettingsStore } from "./ports/board-settings-store";
import type { NoticeRepository } from "./ports/notice-repository";

export interface NoticesDeps {
  notices: NoticeRepository;
  settings: BoardSettingsStore;
  change: ChangeContext;
  /** Tells people about a new post (push through Notifications); may do nothing. */
  announce: (notice: { id: string; title: string; audienceRoles: string[] }) => Promise<void>;
}
