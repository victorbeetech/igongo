/** Use case: give a range of in-stock bands to an event (S17-06). */

import type { ChangeContext } from "@igongo/core";
import { checkRange, type BandRange } from "../../domain/band-range";
import type { BandRepository } from "../ports/band-repository";
import { recordBandChange } from "../record-band-change";

/** Returns how many bands were assigned; bands not in stock are skipped. */
export async function assignRange(bands: BandRepository, ctx: ChangeContext, input: BandRange & { eventKey: string; eventName: string }): Promise<{ assigned: number }> {
  const range = checkRange(input);
  const assigned = await bands.assignRange(range, { eventKey: input.eventKey, eventName: input.eventName }, ctx.now);
  await recordBandChange(ctx, { action: "wristbands.assigned", recordId: input.eventKey, summary: `Assigned ${assigned} wristbands (${range.from} to ${range.to}) to ${input.eventName}` });
  return { assigned };
}
