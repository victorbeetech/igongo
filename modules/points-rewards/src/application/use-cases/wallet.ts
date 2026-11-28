/**
 * A guest's points wallet: balance, what it is worth, when points run out,
 * and the history. Returns only `{ enabled: false }` while the programme is
 * off, so the app has nothing to show.
 */

import { balanceOf, isUsable, type PointsLot } from "../../domain/points-lot";
import { valueOfPoints } from "../../domain/rules";
import type { PointsEvent } from "../../domain/points-event";
import type { PointsDeps } from "../points-deps";
import { readRules } from "./rules";

/** Points that expire within this many days are shown as "expiring soon". */
const EXPIRING_SOON_DAYS = 30;
/** How many history lines the wallet returns. */
const HISTORY_LIMIT = 20;

/** The wallet as the guest app shows it. */
export type Wallet =
  | { enabled: false }
  | {
      enabled: true;
      balance: number;
      valueUgx: number;
      minimumToRedeem: number;
      ugxPerPoint: number;
      pointsPer1000Ugx: number;
      expiryDays: number;
      /** Points that expire soon, with the earliest date, or null when none do. */
      expiringSoon: { points: number; expiresOn: Date } | null;
      history: PointsEvent[];
    };

/** The guest's wallet at [now]. */
export async function walletFor(deps: PointsDeps, guestId: string, now: Date): Promise<Wallet> {
  const rules = await readRules(deps);
  // Switched off: the guest learns nothing about points.
  if (!rules.enabled) return { enabled: false };

  const lots = await deps.store.lotsOf(guestId);
  const balance = balanceOf(lots, now);
  const history = await deps.store.eventsOf(guestId, HISTORY_LIMIT);
  return {
    enabled: true,
    balance,
    valueUgx: valueOfPoints(rules, balance),
    minimumToRedeem: rules.minimumToRedeem,
    ugxPerPoint: rules.ugxPerPoint,
    pointsPer1000Ugx: rules.pointsPer1000Ugx,
    expiryDays: rules.expiryDays,
    expiringSoon: expiringSoon(lots, now),
    history,
  };
}

/** The soonest expiry within the warning window: the points that expire then, and the date. */
export function expiringSoon(lots: PointsLot[], now: Date): { points: number; expiresOn: Date } | null {
  const horizon = now.getTime() + EXPIRING_SOON_DAYS * 24 * 60 * 60 * 1000;
  // Lots that still have points and expire within the window (with a date).
  const soon: { lot: PointsLot; expiresOn: Date }[] = [];
  for (const lot of lots) {
    if (!isUsable(lot, now) || lot.expiresAt === null) continue;
    if (lot.expiresAt.getTime() <= horizon) soon.push({ lot, expiresOn: lot.expiresAt });
  }
  if (soon.length === 0) return null;
  // The earliest date, then every lot that expires on that same calendar day counted together.
  const first = soon.reduce((a, b) => (a.expiresOn.getTime() <= b.expiresOn.getTime() ? a : b));
  const day = first.expiresOn.toISOString().slice(0, 10);
  const points = soon.filter((s) => s.expiresOn.toISOString().slice(0, 10) === day).reduce((sum, s) => sum + s.lot.remaining, 0);
  return { points, expiresOn: first.expiresOn };
}
