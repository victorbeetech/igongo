/** CRM's `GuestDirectory` contract, for other modules' staff screens. */

import type { GuestDirectory } from "@igongo/contracts/crm-guests";
import type { ProfileRepository } from "../application/ports/profile-repository";

export function guestDirectory(profiles: ProfileRepository): GuestDirectory {
  return {
    byUserIds: async (ids) =>
      (await profiles.byUserIds(ids)).flatMap((p) => (p.userId ? [{ userId: p.userId, name: p.name, phone: p.phone, tags: p.tags }] : [])),
  };
}
