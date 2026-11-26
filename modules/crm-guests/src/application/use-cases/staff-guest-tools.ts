/**
 * Use cases for staff on guest profiles (S54-01, S54-02):
 *   - createWalkIn: a profile for a guest at the desk who has no account;
 *   - tagGuest: set a guest's tags (only tags on the super admin's list);
 *   - addStaffNote: keep a note on a guest.
 */

import { AppError, newId, recordChange } from "@igongo/core";
import type { GuestProfile } from "../../domain/guest-profile";
import { NO_CONSENT } from "../../domain/marketing-consent";
import type { StaffNote } from "../../domain/staff-note";
import type { CrmDeps } from "../crm-deps";

/** The profile [id]. @throws AppError not_found */
async function profileOf(deps: CrmDeps, id: string): Promise<GuestProfile> {
  const profile = await deps.profiles.byId(id);
  if (!profile) throw new AppError("not_found", "Guest not found.");
  return profile;
}

export async function createWalkIn(deps: CrmDeps, input: { name: string; phone?: string; email?: string }): Promise<GuestProfile> {
  const now = deps.change.now;
  const profile: GuestProfile = { id: newId("gst"), userId: null, name: input.name, email: input.email ?? null, phone: input.phone ?? null, nationality: null, birthday: null, preferences: null, allergies: null, tags: [], consent: NO_CONSENT, createdAt: now, updatedAt: now };
  await deps.profiles.save(profile);
  await recordChange(deps.change, { module: "crm-guests", action: "guest.created", recordType: "guest", recordId: profile.id, summary: `Added walk-in guest ${profile.name}` });
  return profile;
}

export async function tagGuest(deps: CrmDeps, id: string, tags: string[]): Promise<GuestProfile> {
  const allowed = new Set((await deps.settings.read()).tags);
  const unknown = tags.filter((t) => !allowed.has(t));
  if (unknown.length) throw new AppError("bad_request", `Not on the tag list: ${unknown.join(", ")}.`);
  const profile = { ...(await profileOf(deps, id)), tags: [...new Set(tags)], updatedAt: deps.change.now };
  await deps.profiles.save(profile);
  await recordChange(deps.change, { module: "crm-guests", action: "guest.tagged", recordType: "guest", recordId: id, summary: `Tagged ${profile.name}: ${profile.tags.join(", ") || "no tags"}` });
  return profile;
}

export async function addStaffNote(deps: CrmDeps, id: string, text: string): Promise<StaffNote> {
  const profile = await profileOf(deps, id);
  const note: StaffNote = { id: newId("gnt"), profileId: id, text, byUserId: deps.change.actorId, byName: deps.change.actorName ?? null, at: deps.change.now };
  await deps.profiles.addNote(note);
  await recordChange(deps.change, { module: "crm-guests", action: "guest.note_added", recordType: "guest", recordId: id, summary: `Added a note on ${profile.name}` });
  return note;
}
