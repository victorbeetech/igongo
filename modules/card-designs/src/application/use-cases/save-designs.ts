/** Saves the whole design set after checking it, and records the change. */

import { AppError, recordChange } from "@igongo/core";
import type { CardDesigns } from "../../domain/card-designs";
import { checkDesigns } from "../../domain/check-designs";
import type { DesignsDeps } from "../designs-deps";

export async function saveDesigns(deps: DesignsDeps, designs: CardDesigns): Promise<CardDesigns> {
  // Step 1: refuse a set that breaks a rule, with the reason.
  const problem = checkDesigns(designs);
  if (problem) throw new AppError("bad_request", problem);
  // Step 2: save and record.
  await deps.store.write(designs, deps.change.actorId, deps.change.now);
  await recordChange(deps.change, { module: "staff-cards", action: "card_designs.saved", recordType: "card_designs", recordId: "designs", summary: `${designs.templates.length} templates, ${designs.types.length} card types, default ${designs.defaultTemplate}, ${Object.keys(designs.byRole).length} roles with their own template` });
  return designs;
}
