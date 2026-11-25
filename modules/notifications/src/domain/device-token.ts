/** One phone's push token, saved for the person signed in on it. */

import type { DevicePlatform } from "@igongo/contracts/notifications";

/** A device token as stored by this module. */
export interface DeviceToken {
  /** The FCM registration token. Unique: one token is one app install. */
  token: string;
  /** The person signed in on that phone. */
  userId: string;
  /** Android, iOS or web. */
  platform: DevicePlatform;
  /** When the token was first saved. */
  createdAt: Date;
  /** When the phone last registered it; old tokens can be cleaned up. */
  lastSeenAt: Date;
}
