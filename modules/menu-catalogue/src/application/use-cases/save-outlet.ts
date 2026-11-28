/**
 * Use cases that change the venues guests can order from (S61-01), the
 * super admin's list: add a venue, rename it or switch it on and off for
 * guests, and remove it. Every change goes to the Audit Trail.
 * The guest list is `clientOutlets`: a venue is on when its key is in it.
 */

import { AppError, recordChange } from "@igongo/core";
import type { OutletRef } from "@igongo/contracts/menu-catalogue";
import { outletKeyFor } from "../../domain/outlet-key";
import type { MenuDeps } from "../menu-deps";

/** The most venues the hotel may list (the same limit the settings take). */
export const MAX_OUTLETS = 30;

/** What the super admin types for a new venue. */
export interface NewOutlet {
  name: string;
  /** Whether guests see it straight away. */
  clientVisible: boolean;
}

/** What the super admin changes on one venue; leave a field out to keep it. */
export interface OutletPatch {
  name?: string;
  clientVisible?: boolean;
}

/** A venue as the super admin sees it: its key, name and whether guests see it. */
export interface OutletView extends OutletRef {
  clientVisible: boolean;
}

/** Adds a venue, with a key made from its name. @throws AppError bad_request when the list is full */
export async function addOutlet(deps: MenuDeps, input: NewOutlet): Promise<OutletView> {
  // Step 1: read the list as it is now.
  const s = await deps.settings.read();
  // Step 2: refuse when the hotel already has the most venues allowed.
  if (s.outlets.length >= MAX_OUTLETS) throw new AppError("bad_request", `The menu allows up to ${MAX_OUTLETS} venues.`);
  // Step 3: make a key no venue uses, then add the venue, and add it to the guest list if it is on.
  const key = outletKeyFor(input.name, new Set(s.outlets.map((o) => o.key)));
  const outlet: OutletRef = { key, name: input.name };
  await deps.settings.write(
    { outlets: [...s.outlets, outlet], clientOutlets: input.clientVisible ? [...s.clientOutlets, key] : s.clientOutlets },
    deps.change.actorId,
    deps.change.now,
  );
  // Step 4: tell the Audit Trail who added it.
  await recordChange(deps.change, { module: "menu-catalogue", action: "outlet.created", recordType: "outlet", recordId: key, summary: `Added venue ${input.name}` });
  return { ...outlet, clientVisible: input.clientVisible };
}

/** Renames a venue or switches it on or off for guests. @throws AppError not_found */
export async function editOutlet(deps: MenuDeps, key: string, patch: OutletPatch): Promise<OutletView> {
  // Step 1: read the list and find the venue; refuse when it is not there.
  const s = await deps.settings.read();
  const before = s.outlets.find((o) => o.key === key);
  if (!before) throw new AppError("not_found", "Venue not found.");
  // Step 2: the new name, if one was typed.
  const name = patch.name ?? before.name;
  // Step 3: the guest switch: add the key to the guest list to switch it on, take it out to switch it off.
  const wasOn = s.clientOutlets.includes(key);
  const on = patch.clientVisible ?? wasOn;
  const clientOutlets = on ? (wasOn ? s.clientOutlets : [...s.clientOutlets, key]) : s.clientOutlets.filter((k) => k !== key);
  // Step 4: save the list with the change, then record it.
  await deps.settings.write(
    { outlets: s.outlets.map((o) => (o.key === key ? { key, name } : o)), clientOutlets },
    deps.change.actorId,
    deps.change.now,
  );
  await recordChange(deps.change, { module: "menu-catalogue", action: "outlet.changed", recordType: "outlet", recordId: key, summary: `Venue ${name}: ${on ? "shown to guests" : "switched off for guests"}` });
  return { key, name, clientVisible: on };
}

/**
 * Removes a venue. A venue that still has dishes cannot be removed: the super
 * admin switches it off instead, so no dish is left without a venue.
 * @throws AppError not_found, or bad_request when the venue still has dishes
 */
export async function removeOutlet(deps: MenuDeps, key: string): Promise<{ key: string }> {
  // Step 1: read the list and find the venue; refuse when it is not there.
  const s = await deps.settings.read();
  const outlet = s.outlets.find((o) => o.key === key);
  if (!outlet) throw new AppError("not_found", "Venue not found.");
  // Step 2: refuse while dishes still belong to it.
  const dishes = await deps.items.list({ outlet: key });
  if (dishes.length > 0) throw new AppError("bad_request", `${outlet.name} still has ${dishes.length} dishes. Switch it off for guests instead.`);
  // Step 3: take it off the venues list and the guest list, then save.
  await deps.settings.write(
    { outlets: s.outlets.filter((o) => o.key !== key), clientOutlets: s.clientOutlets.filter((k) => k !== key) },
    deps.change.actorId,
    deps.change.now,
  );
  // Step 4: record the removal.
  await recordChange(deps.change, { module: "menu-catalogue", action: "outlet.removed", recordType: "outlet", recordId: key, summary: `Removed venue ${outlet.name}` });
  return { key };
}
