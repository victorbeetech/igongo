/** Where guest profiles and staff notes are kept. */

import type { GuestProfile } from "../../domain/guest-profile";
import type { StaffNote } from "../../domain/staff-note";

export interface ProfileRepository {
  byUserId(userId: string): Promise<GuestProfile | null>;
  byId(id: string): Promise<GuestProfile | null>;
  byUserIds(userIds: string[]): Promise<GuestProfile[]>;
  /** Finds guests by name, phone or email, newest first. */
  search(filter: { q?: string; tag?: string; limit: number }): Promise<GuestProfile[]>;
  save(profile: GuestProfile): Promise<void>;
  notes(profileId: string): Promise<StaffNote[]>;
  addNote(note: StaffNote): Promise<void>;
}
