/** `ProfileRepository` on Postgres, with Drizzle. */

import { omitKey, type Database } from "@igongo/core";
import { and, asc, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import type { ProfileRepository } from "../../application/ports/profile-repository";
import type { GuestProfile } from "../../domain/guest-profile";
import type { StaffNote } from "../../domain/staff-note";
import { profiles, staffNotes } from "./schema";

export class DrizzleProfileRepository implements ProfileRepository {
  constructor(private readonly db: Database) {}

  async byUserId(userId: string): Promise<GuestProfile | null> {
    const [row] = await this.db.select().from(profiles).where(eq(profiles.userId, userId));
    return row ?? null;
  }

  async byId(id: string): Promise<GuestProfile | null> {
    const [row] = await this.db.select().from(profiles).where(eq(profiles.id, id));
    return row ?? null;
  }

  byUserIds(userIds: string[]): Promise<GuestProfile[]> {
    if (!userIds.length) return Promise.resolve([]);
    return this.db.select().from(profiles).where(inArray(profiles.userId, userIds));
  }

  search(filter: { q?: string; tag?: string; limit: number }): Promise<GuestProfile[]> {
    const like = filter.q ? `%${filter.q}%` : null;
    const where = and(
      like ? or(ilike(profiles.name, like), ilike(profiles.phone, like), ilike(profiles.email, like)) : undefined,
      // jsonb `?` asks "does the tags array hold this text".
      filter.tag ? sql`${profiles.tags} ? ${filter.tag}` : undefined,
    );
    return this.db.select().from(profiles).where(where).orderBy(desc(profiles.updatedAt)).limit(filter.limit);
  }

  async save(profile: GuestProfile): Promise<void> {
    await this.db.insert(profiles).values(profile).onConflictDoUpdate({ target: profiles.id, set: omitKey(profile, "id") });
  }

  notes(profileId: string): Promise<StaffNote[]> {
    return this.db.select().from(staffNotes).where(eq(staffNotes.profileId, profileId)).orderBy(asc(staffNotes.at));
  }

  async addNote(note: StaffNote): Promise<void> {
    await this.db.insert(staffNotes).values(note);
  }
}
