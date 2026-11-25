/** Where wristbands and their scans are kept. The Drizzle version is in infrastructure/db. */

import type { BandRange } from "../../domain/band-range";
import type { BandScan } from "../../domain/band-scan";
import type { BandStatus, Wristband } from "../../domain/wristband";

/** Counts for the wristbands home and stock screens. */
export interface BandSummary {
  byStatus: Record<BandStatus, number>;
  /** Bands out per event. */
  events: { eventKey: string; eventName: string | null; count: number }[];
}

export interface BandRepository {
  get(bandNumber: number): Promise<Wristband | null>;
  byUid(uid: string): Promise<Wristband | null>;
  list(filter: { status?: BandStatus; eventKey?: string; range?: BandRange; limit: number; offset: number }): Promise<Wristband[]>;
  summary(): Promise<BandSummary>;
  /** Numbers in [range] that already exist. */
  existingIn(range: BandRange): Promise<number[]>;
  createMany(bands: Wristband[]): Promise<void>;
  /** Gives every in-stock band in [range] to the event; returns how many changed. */
  assignRange(range: BandRange, event: { eventKey: string; eventName: string }, now: Date): Promise<number>;
  /** Puts every assigned or missing band in [range] back in stock; returns how many changed. */
  resetRange(range: BandRange): Promise<number>;
  update(bandNumber: number, changes: Partial<Pick<Wristband, "uid" | "status" | "eventKey" | "eventName" | "assignedAt">>): Promise<void>;
  addScan(scan: BandScan): Promise<void>;
  scans(filter: { eventKey?: string; bandNumber?: number; limit: number }): Promise<BandScan[]>;
}
