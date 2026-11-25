/** Use case: mark one band missing or retired, or link its NFC chip. */

import { AppError, normalizeUid, type ChangeContext } from "@igongo/core";
import type { Wristband } from "../../domain/wristband";
import type { BandRepository } from "../ports/band-repository";
import { recordBandChange } from "../record-band-change";

/** @throws AppError `not_found`, or `conflict` when another band has the chip */
export async function updateBand(bands: BandRepository, ctx: ChangeContext, bandNumber: number, change: { status?: "missing" | "retired" | "in_stock"; uid?: string }): Promise<Wristband> {
  const band = await bands.get(bandNumber);
  if (!band) throw new AppError("not_found", `Band ${bandNumber} is not registered.`);
  // Chip UIDs are stored tidied, the same way Staff Cards stores them.
  if (change.uid) change = { ...change, uid: normalizeUid(change.uid) };
  if (change.uid) {
    const other = await bands.byUid(change.uid);
    if (other && other.bandNumber !== bandNumber) throw new AppError("conflict", `This chip already belongs to band ${other.bandNumber}.`);
  }
  // Back in stock clears the event.
  const clear = change.status === "in_stock" ? { eventKey: null, eventName: null, assignedAt: null } : {};
  await bands.update(bandNumber, { ...change, ...clear });
  const what = change.uid ? `encoded with chip ${change.uid}` : `marked ${change.status?.replace("_", " ")}`;
  await recordBandChange(ctx, { action: change.uid ? "wristband.encoded" : `wristband.${change.status}`, recordId: String(bandNumber), summary: `Band ${bandNumber} ${what}` });
  return (await bands.get(bandNumber)) as Wristband;
}
