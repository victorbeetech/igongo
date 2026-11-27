/**
 * Use cases for a guest's own profile (S54-05, S54-06, S54-07):
 *   - myProfile: the profile of the signed-in account, made on first use
 *     from the account's name and email;
 *   - updateMyProfile: change my details;
 *   - setMyConsent: change my marketing choices.
 */

import { newId, recordChange } from "@igongo/core";
import type { GuestProfile } from "../../domain/guest-profile";
import { NO_CONSENT, type MarketingConsent } from "../../domain/marketing-consent";
import type { CrmDeps } from "../crm-deps";

/** The fields a guest may change on their own profile (checked by the route's schema first). */
export type MyDetails = Partial<Pick<GuestProfile, "name" | "phone" | "email" | "nationality" | "birthday" | "preferences" | "allergies">>;

/** My profile; created the first time I open it. */
export async function myProfile(deps: CrmDeps, me: { userId: string; name: string; email: string }): Promise<GuestProfile> {
  const found = await deps.profiles.byUserId(me.userId);
  if (found) return found;
  const now = deps.change.now;
  const profile: GuestProfile = {
    id: newId("gst"),
    userId: me.userId,
    name: me.name,
    email: me.email,
    phone: null,
    nationality: null,
    birthday: null,
    preferences: null,
    allergies: null,
    tags: [],
    consent: NO_CONSENT,
    createdAt: now,
    updatedAt: now,
  };
  await deps.profiles.save(profile);
  return profile;
}

/** Saves [details] on my profile and records the change. */
export async function updateMyProfile(deps: CrmDeps, me: { userId: string; name: string; email: string }, details: MyDetails): Promise<GuestProfile> {
  const profile = { ...(await myProfile(deps, me)), ...details, updatedAt: deps.change.now };
  await deps.profiles.save(profile);
  await recordChange(deps.change, { module: "crm-guests", action: "guest.updated", recordType: "guest", recordId: profile.id, summary: `${profile.name} updated their details` });
  return profile;
}

/** Saves my marketing choices, with the time, as the Data Protection Act needs. */
export async function setMyConsent(deps: CrmDeps, me: { userId: string; name: string; email: string }, choice: Omit<MarketingConsent, "changedAt">): Promise<GuestProfile> {
  const consent = { ...choice, changedAt: deps.change.now.toISOString() };
  const profile = { ...(await myProfile(deps, me)), consent, updatedAt: deps.change.now };
  await deps.profiles.save(profile);
  const on = Object.entries(choice).filter(([, v]) => v).map(([k]) => k);
  await recordChange(deps.change, { module: "crm-guests", action: "guest.consent_changed", recordType: "guest", recordId: profile.id, summary: `${profile.name} allows marketing by: ${on.join(", ") || "nothing"}` });
  return profile;
}
