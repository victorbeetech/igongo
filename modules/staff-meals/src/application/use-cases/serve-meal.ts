/**
 * Use case: the canteen serves a meal (S32-02, S32-03). The attendant taps
 * or scans the staff card (or picks the person by hand); steps:
 *   1. find the person (from the card, which must be in use),
 *   2. pick the meal being served now, unless one is named,
 *   3. refuse a second serving of the same meal that day,
 *   4. save it and record it.
 */

import type { StaffRef } from "@igongo/contracts/hr-records";
import type { CardScan } from "@igongo/contracts/staff-cards";
import { AppError, hotelDate, newId, recordChange } from "@igongo/core";
import type { ClaimMethod, MealClaim } from "../../domain/meal-claim";
import { mealServedAt } from "../../domain/meal-rules";
import type { MealsDeps } from "../meals-deps";

export interface ServeInput {
  scan?: CardScan;
  /** For a manual serving, when the card is not at hand. */
  staffId?: string;
  mealKey?: string;
}

/** The person to serve. @throws AppError for unknown, unused or inactive cards and people */
async function personFor(deps: MealsDeps, input: ServeInput): Promise<{ staff: StaffRef; method: ClaimMethod }> {
  if (input.scan) {
    const card = await deps.cards.resolve(input.scan);
    if (!card) throw new AppError("not_found", "This card is not registered.");
    if (card.status !== "active" || !card.staffId) throw new AppError("permission_denied", `Card ${card.cardNumber} is not in use.`);
    const staff = await deps.staff.byId(card.staffId);
    if (!staff) throw new AppError("not_found", "The holder of this card was not found.");
    return { staff, method: input.scan.uid ? "nfc" : "qr" };
  }
  const staff = input.staffId ? await deps.staff.byId(input.staffId) : null;
  if (!staff) throw new AppError("not_found", "Staff member not found.");
  return { staff, method: "manual" };
}

export async function serveMeal(deps: MealsDeps, input: ServeInput): Promise<{ claim: MealClaim; staff: StaffRef; mealName: string }> {
  const now = deps.change.now;
  // 1. Who.
  const { staff, method } = await personFor(deps, input);
  if (staff.status !== "active") throw new AppError("permission_denied", `${staff.name} is not an active staff member.`);
  // 2. Which meal.
  const rules = await deps.rules.read();
  const meal = input.mealKey ? rules.meals.find((m) => m.key === input.mealKey) : mealServedAt(rules, now);
  if (!meal) throw new AppError("conflict", input.mealKey ? "That meal is not on the list." : "No staff meal is being served right now.");
  // 3. Once a day.
  const workDate = hotelDate(now);
  if (await deps.claims.find(staff.staffId, workDate, meal.key)) throw new AppError("conflict", `${staff.name} has already had ${meal.name.toLowerCase()} today.`);
  // 4. Save and record.
  const claim: MealClaim = { id: newId("meal"), staffId: staff.staffId, department: staff.department, workDate, mealKey: meal.key, method, servedBy: deps.change.actorId, at: now };
  await deps.claims.add(claim);
  await recordChange(deps.change, { module: "staff-meals", action: "meal.served", recordType: "staff", recordId: staff.staffId, summary: `Served ${meal.name.toLowerCase()} to ${staff.name}` });
  return { claim, staff, mealName: meal.name };
}
