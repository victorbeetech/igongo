/**
 * Permission keys Chat checks. Staff hold them with scope `own` (their own
 * chats); the Guest role too, for chats with a desk.
 */

export const CHAT_PERMISSIONS = {
  view: "chat.messages.view",
  create: "chat.messages.create",
  settings: "chat.settings.edit",
} as const;
