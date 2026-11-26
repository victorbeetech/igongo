/**
 * Use case: a staff member taps their card at the buffet (S31-03). Steps:
 * find who holds the card, pick their pass that ends soonest, refuse a
 * second pass the same day when the super admin says so, use it, audit it.
 * The answer is a plain verdict the buffet screen shows in big letters.
 */

import type { CardScan } from "@igongo/contracts/staff-cards";
import { hotelDate, newId, recordChange } from "@igongo/core";
import { hasPassFor } from "../../domain/bonus";
import type { BonusesDeps } from "../bonuses-deps";

export type BuffetVerdict =
  | { ok: true; staffName: string; passesLeft: number; validUntil: string | null }
  | { ok: false; reason: "unknown_card" | "no_pass" | "used_today"; staffName: string | null; message: string };

export async function redeemBuffet(deps: BonusesDeps, scan: CardScan | { staffId: string }, by: string): Promise<BuffetVerdict> {
  // 1. Who is it?
  let staffId: string | null = null;
  if ("staffId" in scan) staffId = scan.staffId;
  else {
    const card = await deps.cards.resolve(scan);
    staffId = card?.status === "active" ? card.staffId : null;
  }
  const staff = staffId ? await deps.staff.byId(staffId) : null;
  if (!staff) return { ok: false, reason: "unknown_card", staffName: null, message: "This card is not in use." };
  // 2. Their pass that ends soonest.
  const today = hotelDate(deps.change.now);
  const passes = (await deps.bonuses.list({ staffId: staff.staffId, kind: "buffet", status: "approved", limit: 100 })).filter((b) => hasPassFor(b, today)).sort((a, b) => (a.validUntil ?? "").localeCompare(b.validUntil ?? ""));
  const bonus = passes[0];
  if (!bonus) return { ok: false, reason: "no_pass", staffName: staff.name, message: `${staff.name} has no buffet pass.` };
  // 3. One a day, when the super admin says so.
  if ((await deps.rules.read()).onePassPerDay && (await deps.bonuses.usedOn(staff.staffId, today))) return { ok: false, reason: "used_today", staffName: staff.name, message: `${staff.name} already used a pass today.` };
  // 4. Use it (the store refuses if another station just used the last one).
  if (!(await deps.bonuses.usePass({ id: newId("buf"), bonusId: bonus.id, staffId: staff.staffId, workDate: today, servedByName: by, at: deps.change.now }))) return { ok: false, reason: "no_pass", staffName: staff.name, message: `${staff.name} has no buffet pass.` };
  await recordChange(deps.change, { module: "bonuses-rewards", action: "buffet.used", recordType: "bonus", recordId: bonus.id, summary: `${staff.name} used a buffet pass` });
  const left = passes.reduce((n, b) => n + b.passes - b.passesUsed, 0) - 1;
  return { ok: true, staffName: staff.name, passesLeft: left, validUntil: bonus.validUntil };
}
