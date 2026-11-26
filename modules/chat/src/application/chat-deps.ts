/** Everything Chat's use cases need, given by the gateway per request. */

import type { FileDirectory } from "@igongo/contracts/files-media";
import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext } from "@igongo/core";
import type { ChatRepository } from "./ports/chat-repository";
import type { ChatSettingsStore } from "./ports/settings-store";

export interface ChatDeps {
  chats: ChatRepository;
  settings: ChatSettingsStore;
  /** To find staff to start a chat with. */
  staff: StaffDirectory;
  files: FileDirectory;
  change: ChangeContext;
}
