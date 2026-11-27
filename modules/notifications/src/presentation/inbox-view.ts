/** Turns an inbox item from the domain into the JSON the app receives. */

import type { InboxItemView } from "@igongo/contracts/notifications";
import type { InboxItem } from "../domain/inbox-item";

/** The item as the app sees it: times as ISO text, and no owner ID. */
export function toInboxItemView(item: InboxItem): InboxItemView {
  return {
    id: item.id,
    title: item.title,
    body: item.body,
    channel: item.channel,
    link: item.link,
    createdAt: item.createdAt.toISOString(),
    readAt: item.readAt ? item.readAt.toISOString() : null,
  };
}
