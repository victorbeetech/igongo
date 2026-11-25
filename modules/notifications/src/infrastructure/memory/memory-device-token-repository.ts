/** Device tokens in memory, for tests and local development. */

import type { DevicePlatform } from "@igongo/contracts/notifications";
import type { DeviceTokenRepository } from "../../application/ports/device-token-repository";
import type { DeviceToken } from "../../domain/device-token";

/** `DeviceTokenRepository` in a Map. */
export class MemoryDeviceTokenRepository implements DeviceTokenRepository {
  /** Every token, by token. */
  readonly rows = new Map<string, DeviceToken>();

  async upsert(input: { token: string; userId: string; platform: DevicePlatform; now: Date }): Promise<void> {
    const old = this.rows.get(input.token);
    this.rows.set(input.token, {
      token: input.token,
      userId: input.userId,
      platform: input.platform,
      createdAt: old?.createdAt ?? input.now,
      lastSeenAt: input.now,
    });
  }

  async removeForUser(token: string, userId: string): Promise<boolean> {
    if (this.rows.get(token)?.userId !== userId) return false;
    return this.rows.delete(token);
  }

  async removeMany(tokens: string[]): Promise<void> {
    for (const token of tokens) this.rows.delete(token);
  }

  async findByUsers(userIds: string[]): Promise<DeviceToken[]> {
    return [...this.rows.values()].filter((row) => userIds.includes(row.userId));
  }
}
