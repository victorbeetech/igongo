/**
 * Roles to people from a fixed list. Used until Roles & Permissions publishes
 * its "who holds this role" API, and in tests.
 */

import type { AudienceDirectory } from "../../application/ports/audience-directory";

/** `AudienceDirectory` from a map of role to user IDs. */
export class MemoryAudienceDirectory implements AudienceDirectory {
  constructor(private readonly holders: Record<string, string[]> = {}) {}

  async usersWithRoles(roles: string[]): Promise<string[]> {
    return [...new Set(roles.flatMap((role) => this.holders[role] ?? []))];
  }
}
