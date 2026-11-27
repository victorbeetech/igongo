/**
 * One in-app notification for one person, as the Alerts inbox keeps it.
 * Each item belongs to exactly one person, and only that person may read or
 * mark it.
 */

import type { PushChannelId } from "@igongo/contracts/notifications";

/** An inbox item as the module works with it. */
export interface InboxItem {
  /** The item's ID (prefixed `ntf_`). */
  id: string;
  /** The person it belongs to. */
  userId: string;
  /** Short heading, such as "Order ready". */
  title: string;
  /** The message itself. */
  body: string;
  /** The channel it was sent on. */
  channel: PushChannelId;
  /** The app screen it opens, or null when it opens nothing. */
  link: string | null;
  /** When it was created. */
  createdAt: Date;
  /** When the person opened it, or null while unread. */
  readAt: Date | null;
}
