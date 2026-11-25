/** Port: where device tokens are saved (Postgres in production, memory in tests). */

import type { DevicePlatform } from "@igongo/contracts/notifications";
import type { DeviceToken } from "../../domain/device-token";

/** Saves, finds and deletes device tokens. */
export interface DeviceTokenRepository {
  /**
   * Saves [token] for [userId], or moves it to [userId] if another person
   * used that phone before. Updates `lastSeenAt` either way.
   */
  upsert(input: { token: string; userId: string; platform: DevicePlatform; now: Date }): Promise<void>;
  /** Deletes [token] if it belongs to [userId]. Returns true if one was deleted. */
  removeForUser(token: string, userId: string): Promise<boolean>;
  /** Deletes tokens FCM reported dead, whoever they belong to. */
  removeMany(tokens: string[]): Promise<void>;
  /** Every token of these people. */
  findByUsers(userIds: string[]): Promise<DeviceToken[]>;
}
