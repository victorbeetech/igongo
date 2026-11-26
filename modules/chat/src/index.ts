/**
 * Chat (module 50) of the Igongo API: staff chat and guest chat with a desk.
 * The gateway imports only this file.
 */

export type { ChatDeps } from "./application/chat-deps";
export { DEFAULT_CHAT_SETTINGS, type ChatSettings } from "./domain/chat-settings";
export { desksOf } from "./domain/chat-viewer";
export { chatKpis } from "./infrastructure/chat-kpis";
export { DrizzleChatRepository } from "./infrastructure/db/drizzle-chat-repository";
export { SettingsChatStore } from "./infrastructure/db/settings-chat-store";
export { CHAT_PERMISSIONS } from "./presentation/permissions";
export { chatRouter } from "./presentation/chat-router";
