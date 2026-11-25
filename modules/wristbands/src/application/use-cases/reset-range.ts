/** Use case: take a range of bands back into stock after an event. */

import type { ChangeContext } from "@igongo/core";
import { checkRange, type BandRange } from "../../domain/band-range";
import type { BandRepository } from "../ports/band-repository";
import { recordBandChange } from "../record-band-change";

/** Returns how many bands went back into stock. */
export async function resetRange(bands: BandRepository, ctx: ChangeContext, input: BandRange): Promise<{ reset: number }> {
  const range = checkRange(input);
  const reset = await bands.resetRange(range);
  await recordBandChange(ctx, { action: "wristbands.reset", recordId: `${range.from}-${range.to}`, summary: `Reset ${reset} wristbands (${range.from} to ${range.to}) back to stock` });
  return { reset };
}
