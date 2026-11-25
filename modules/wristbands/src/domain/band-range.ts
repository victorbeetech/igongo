/** A range of band numbers, both ends included, such as 1 to 200. */

import { AppError } from "@igongo/core";
import { MAX_RANGE } from "./wristband";

export interface BandRange {
  from: number;
  to: number;
}

/** Checks [range]. @throws AppError `bad_request` when backwards or too big */
export function checkRange(range: BandRange): BandRange {
  if (range.to < range.from) throw new AppError("bad_request", "The range ends before it starts.");
  if (range.to - range.from + 1 > MAX_RANGE) throw new AppError("bad_request", `A range can hold at most ${MAX_RANGE} bands.`);
  return range;
}

/** Every number in [range], in order. */
export function numbersIn(range: BandRange): number[] {
  return Array.from({ length: range.to - range.from + 1 }, (_, i) => range.from + i);
}
