/**
 * Notice Board (module 49) of the Igongo API. The gateway imports only this
 * file. See modules/notice-board/README.md.
 */

export type { NoticesDeps } from "./application/notices-deps";
export { DEFAULT_BOARD_SETTINGS, type BoardSettings } from "./domain/board-settings";
export { canSee, type Notice } from "./domain/notice";
export { DrizzleNoticeRepository } from "./infrastructure/db/drizzle-notice-repository";
export { SettingsBoardStore } from "./infrastructure/db/settings-board-store";
export { NOTICE_PERMISSIONS } from "./presentation/permissions";
export { noticesRouter } from "./presentation/notices-router";
