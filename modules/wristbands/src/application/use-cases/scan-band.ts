/**
 * Use case: a door scans a band. Finds it by chip, QR or typed number, works
 * out the verdict, and logs the scan (every scan, even refused ones).
 */

import { newId, normalizeUid, type ChangeContext } from "@igongo/core";
import { parseBandQr } from "../../domain/band-codes";
import type { ScanResult } from "../../domain/band-scan";
import { scanVerdict } from "../../domain/scan-verdict";
import type { Wristband } from "../../domain/wristband";
import type { BandRepository } from "../ports/band-repository";

export interface ScanInput {
  uid?: string;
  qr?: string;
  bandNumber?: number;
  /** The event the door is checking for. */
  eventKey?: string;
}

/** Finds the band behind [input], or null. A QR with the wrong token finds nothing. */
async function findBand(bands: BandRepository, input: ScanInput): Promise<Wristband | null> {
  if (input.uid) return bands.byUid(normalizeUid(input.uid));
  if (input.qr) {
    const code = parseBandQr(input.qr);
    const band = code ? await bands.get(code.bandNumber) : null;
    return band && band.qrToken === code?.qrToken ? band : null;
  }
  return input.bandNumber ? bands.get(input.bandNumber) : null;
}

export async function scanBand(bands: BandRepository, ctx: ChangeContext, input: ScanInput): Promise<{ result: ScanResult; band: Wristband | null }> {
  const band = await findBand(bands, input);
  const result = scanVerdict(band, input.eventKey ?? null);
  await bands.addScan({ id: newId("bscan"), bandNumber: band?.bandNumber ?? null, eventKey: input.eventKey ?? null, result, actorId: ctx.actorId, at: ctx.now });
  return { result, band };
}
