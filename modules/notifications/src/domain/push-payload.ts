/**
 * What a push says, whatever channel or target it goes to. The app reads the
 * same fields back (see the app's `push_message.dart`).
 */

import type { PushChannelId } from "@igongo/contracts/notifications";

/** The content of one push notification. */
export interface PushPayload {
  /** This notification's ID, for the inbox and read receipts. */
  notificationId: string;
  /** The heading shown on the phone. */
  title: string;
  /** The text under the heading. */
  body: string;
  /** Which Android channel it goes in, which sets how loud it is. */
  channel: PushChannelId;
  /** The app screen to open on tap, such as `/tasks/42`. Must start with `/`. */
  link?: string;
  /** Any extra values for the app. Keys must not clash with the ones above. */
  data?: Record<string, string>;
}

/** The flat string map FCM carries in `data`, which the app reads. */
export function payloadData(payload: PushPayload): Record<string, string> {
  return {
    ...payload.data,
    notificationId: payload.notificationId,
    channel: payload.channel,
    ...(payload.link ? { link: payload.link } : {}),
  };
}
