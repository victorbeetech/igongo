/**
 * An in-memory points store and a fixed clock for the tests. It follows the
 * same rules as the Postgres store (one source reference is kept once), so
 * the use cases are tested without a database.
 */

import type { ChangeContext } from "@igongo/core";
import type { PointsCommit, PointsStore } from "../src/application/ports/points-store";
import type { PointsDeps } from "../src/application/points-deps";
import type { PointsEvent } from "../src/domain/points-event";
import type { PointsLot } from "../src/domain/points-lot";
import { DEFAULT_POINTS_RULES, type PointsRules } from "../src/domain/rules";

/** A store kept in memory: rules, lots and history. */
export class FakePointsStore implements PointsStore {
  rules: PointsRules = { ...DEFAULT_POINTS_RULES };
  lots: PointsLot[] = [];
  events: PointsEvent[] = [];
  /** How many times commit ran, so tests can prove a retry wrote nothing. */
  commits = 0;

  async readRules(): Promise<PointsRules> {
    return { ...this.rules };
  }
  async writeRules(rules: PointsRules): Promise<void> {
    this.rules = { ...rules };
  }
  async lotsOf(guestId: string): Promise<PointsLot[]> {
    return this.lots.filter((l) => l.guestId === guestId).map((l) => ({ ...l }));
  }
  async lotsDueForExpiry(now: Date): Promise<PointsLot[]> {
    return this.lots.filter((l) => l.remaining > 0 && l.expiresAt !== null && l.expiresAt.getTime() <= now.getTime()).map((l) => ({ ...l }));
  }
  async hasSource(sourceRef: string): Promise<boolean> {
    return this.events.some((e) => e.sourceRef === sourceRef);
  }
  async eventsOf(guestId: string, limit: number): Promise<PointsEvent[]> {
    return this.events
      .filter((e) => e.guestId === guestId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
  async commit(change: PointsCommit): Promise<void> {
    this.commits += 1;
    for (const lot of change.lots) {
      const i = this.lots.findIndex((l) => l.id === lot.id);
      if (i >= 0) this.lots[i] = { ...lot };
      else this.lots.push({ ...lot });
    }
    this.events.push(...change.events.map((e) => ({ ...e })));
  }
}

/** A change context with a fixed time and an audit recorder that keeps nothing. */
export function fakeChange(now: Date): ChangeContext {
  return {
    actorId: "admin-1",
    now,
    audit: { record: async () => undefined } as unknown as ChangeContext["audit"],
  };
}

/** Deps for a test: a fresh fake store and a clock at [now]. */
export function fakeDeps(now: Date, store = new FakePointsStore()): PointsDeps & { store: FakePointsStore } {
  return { store, change: fakeChange(now) };
}

/** A fixed day used across the tests. */
export const NOW = new Date("2026-11-28T10:00:00Z");
