/** Where the chat settings are kept. */

import type { ChatSettings } from "../../domain/chat-settings";

export interface ChatSettingsStore {
  read(): Promise<ChatSettings>;
  write(settings: ChatSettings, by: string | null, now: Date): Promise<void>;
}
