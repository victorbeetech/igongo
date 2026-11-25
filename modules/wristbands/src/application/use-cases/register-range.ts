/**
 * Use case: register a range of new bands once, such as 1 to 5000. Numbers
 * that already exist are skipped, so the same range can be sent twice.
 */

import type { ChangeContext } from "@igongo/core";
import { checkRange, numbersIn, type BandRange } from "../../domain/band-range";
import type { Wristband } from "../../domain/wristband";
import type { BandRepository } from "../ports/band-repository";
import { recordBandChange } from "../record-band-change";

/** Returns how many bands were added and how many already existed. */
export async function registerRange(bands: BandRepository, ctx: ChangeContext, input: BandRange & { bandType?: string }): Promise<{ added: number; skipped: number }> {
  // 1. Work out the new numbers.
  const range = checkRange(input);
  const existing = new Set(await bands.existingIn(range));
  const fresh = numbersIn(range).filter((n) => !existing.has(n));
  // 2. Each new band gets its own random QR token.
  const rows: Wristband[] = fresh.map((bandNumber) => ({
    bandNumber,
    uid: null,
    qrToken: crypto.randomUUID().replace(/-/g, ""),
    bandType: input.bandType ?? "event",
    status: "in_stock",
    eventKey: null,
    eventName: null,
    assignedAt: null,
    createdAt: ctx.now,
  }));
  await bands.createMany(rows);
  // 3. One record for the whole range.
  if (rows.length) await recordBandChange(ctx, { action: "wristbands.registered", recordId: `${range.from}-${range.to}`, summary: `Registered ${rows.length} wristbands, numbers ${range.from} to ${range.to}` });
  return { added: rows.length, skipped: existing.size };
}
