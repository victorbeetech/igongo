/**
 * One page of a person's inbox, newest first, with the unread count the
 * app's badge needs. `nextBefore` is the time to pass to get the next page,
 * or null when this was the last page.
 */

import type { InboxItem } from "./inbox-item";

/** One page of inbox items plus the badge count. */
export interface InboxPage {
  /** The items on this page, newest first. */
  items: InboxItem[];
  /** How many of the person's items are unread, across all pages. */
  unreadCount: number;
  /** Pass this as `before` to get the next page, or null at the end. */
  nextBefore: Date | null;
}
