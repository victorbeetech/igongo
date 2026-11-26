// The hand-made web pages of module 50 (Chat), live from the API.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { ChatsPage } from "./presentation/chats/ChatsPage";
import { NewChatPage } from "./presentation/new-chat/NewChatPage";
import { ChatRoomPage } from "./presentation/room/ChatRoomPage";
import { ChatSettingsPage } from "./presentation/settings/ChatSettingsPage";

/** Module 50's hand-made web pages. */
export const m50Overrides: ScreenOverrides = {
  "S50-01": (s) => <ChatsPage screen={s} />,
  "S50-02": (s) => <ChatRoomPage screen={s} />,
  "S50-03": (s) => <NewChatPage screen={s} />,
  "S50-05": (s) => <ChatSettingsPage screen={s} />,
};
