/**
 * Builds the FCM HTTP v1 message body for one push.
 * Reference: https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages
 */

import { payloadData, type PushPayload } from "../../domain/push-payload";

/** The status bar icon the app ships (from packages/brand). */
const ANDROID_ICON = "ic_stat_igongo";

/** Channels that must wake the phone at once. */
const HIGH_PRIORITY = new Set(["urgent", "bookings"]);

/** The `message` object for [payload], sent to a token or a topic. */
export function fcmMessage(payload: PushPayload, to: { token: string } | { topic: string }): Record<string, unknown> {
  const urgent = HIGH_PRIORITY.has(payload.channel);
  return {
    ...to,
    // Shown by the phone itself when the app is in the background or closed.
    notification: { title: payload.title, body: payload.body },
    // Read by the app for the inbox, the channel and the screen to open.
    data: payloadData(payload),
    android: {
      priority: urgent ? "high" : "normal",
      notification: { channel_id: payload.channel, icon: ANDROID_ICON },
    },
    apns: {
      headers: { "apns-priority": urgent ? "10" : "5" },
      payload: { aps: { sound: "default", "thread-id": payload.channel } },
    },
  };
}
