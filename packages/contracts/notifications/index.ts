/**
 * Public contract of the Notifications Engine (module 10).
 *
 * Other modules, the app and the web only use these types and names to talk
 * to Notifications; they never import the module's internals.
 */

/** The notification channels. Must match the app's `push_channel.dart`. */
export const PUSH_CHANNELS = ["urgent", "work", "messages", "bookings", "general"] as const;

/** One notification channel ID. */
export type PushChannelId = (typeof PUSH_CHANNELS)[number];

/** The platforms a device token can belong to. */
export const DEVICE_PLATFORMS = ["android", "ios", "web"] as const;

/** One device platform. */
export type DevicePlatform = (typeof DEVICE_PLATFORMS)[number];

/** Body of `POST /notifications/devices`. */
export interface RegisterDeviceRequest {
  /** The FCM registration token from the phone. */
  token: string;
  /** Which kind of device sent it. */
  platform: DevicePlatform;
}

/** Answer of `POST /notifications/devices`. */
export interface RegisterDeviceResponse {
  /** Broadcast topics the phone should join, chosen from the person's roles. */
  topics: string[];
}

/** The events this module publishes (see docs/modules/10-notifications.md). */
export const NOTIFICATION_EVENTS = {
  sent: "notification.sent",
  delivered: "notification.delivered",
  failed: "notification.failed",
  read: "notification.read",
} as const;

/**
 * An event from any module that notification rules can react to, such as
 * `fault.reported` from Faults & Maintenance.
 */
export interface DomainEvent {
  /** The event name, such as `fault.reported`. */
  name: string;
  /** Values the message template can use, such as `{ room: "12" }`. */
  data: Record<string, string>;
  /** The app screen the notification opens, such as `/faults/42`. */
  link?: string;
}

/** A short push to some people's phones, such as "Your order F-0042 is ready". */
export interface UserMessage {
  title: string;
  body: string;
  /** The notification channel (sound and importance on the phone). */
  channel: PushChannelId;
  /** The app screen it opens, such as `/orders/ord_123`. */
  link?: string;
}

/**
 * Sends a push to people by user ID. Given by the gateway to modules that
 * tell people about their own things (orders, deliveries, chat). It never
 * fails the caller: with no Firebase keys yet it quietly sends nothing.
 */
export type UserNotifier = (userIds: string[], message: UserMessage) => Promise<void>;

/** One item of the Alerts inbox, as the app receives it from `GET /notifications/inbox`. */
export interface InboxItemView {
  /** The item's ID, used to mark it read. */
  id: string;
  /** Short heading, such as "Order ready". */
  title: string;
  /** The message itself. */
  body: string;
  /** The channel it was sent on. */
  channel: PushChannelId;
  /** The app screen it opens, such as `/orders/ord_1`, or null. */
  link: string | null;
  /** When it was created, as an ISO 8601 time. */
  createdAt: string;
  /** When the person opened it, or null while unread. */
  readAt: string | null;
}

/** Answer of `GET /notifications/inbox`: one page, newest first, plus the badge count. */
export interface InboxPageResponse {
  /** The items on this page. */
  items: InboxItemView[];
  /** The caller's unread items, across all pages. */
  unreadCount: number;
  /** Pass as `before` for the next page, or null at the end. */
  nextBefore: string | null;
}

/** Answer of `POST /notifications/inbox/read-all`. */
export interface MarkAllReadResponse {
  /** How many items changed from unread to read. */
  marked: number;
}
