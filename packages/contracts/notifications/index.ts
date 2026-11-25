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
