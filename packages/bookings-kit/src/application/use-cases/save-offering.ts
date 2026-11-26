/** Use cases for staff managing what a module sells: add and change offerings (each module's catalogue screen). */

import { AppError, newId, recordChange } from "@igongo/core";
import type { Offering } from "../../domain/offering";
import type { BookingsDeps } from "../bookings-deps";

export type OfferingFields = Omit<Offering, "id" | "updatedAt">;

export async function addOffering(deps: BookingsDeps, fields: OfferingFields): Promise<Offering> {
  if (!deps.module.kinds.includes(fields.kind)) throw new AppError("bad_request", `This module does not sell "${fields.kind}" offerings.`);
  const offering: Offering = { ...fields, id: newId("ofr"), updatedAt: deps.change.now };
  await deps.offerings.save(offering);
  await recordChange(deps.change, { module: deps.module.key, action: "offering.created", recordType: "offering", recordId: offering.id, summary: `Added ${offering.name} at ${offering.price} UGX` });
  return offering;
}

export async function editOffering(deps: BookingsDeps, id: string, fields: Partial<OfferingFields>): Promise<Offering> {
  const before = await deps.offerings.byId(id);
  if (!before) throw new AppError("not_found", "Not found.");
  if (fields.kind && fields.kind !== before.kind) throw new AppError("bad_request", "The kind of an offering cannot change. Add a new one.");
  const offering: Offering = { ...before, ...fields, updatedAt: deps.change.now };
  await deps.offerings.save(offering);
  const price = fields.price !== undefined && fields.price !== before.price ? ` (price ${before.price} to ${fields.price} UGX)` : "";
  await recordChange(deps.change, { module: deps.module.key, action: "offering.updated", recordType: "offering", recordId: id, summary: `Changed ${offering.name}${price}` });
  return offering;
}
