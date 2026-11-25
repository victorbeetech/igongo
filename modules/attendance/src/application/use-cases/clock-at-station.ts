/**
 * Use case: a gate or reception device reads a staff card (NFC tap or QR
 * scan) and clocks its holder in or out. Lost, reset and unknown cards are
 * refused with a clear message for the gatekeeper.
 */

import type { CardScan } from "@igongo/contracts/staff-cards";
import type { StaffRef } from "@igongo/contracts/hr-records";
import { AppError } from "@igongo/core";
import type { ClockEvent } from "../../domain/clock-event";
import type { AttendanceDeps } from "../attendance-deps";
import { recordClock } from "./record-clock";

/** @throws AppError `not_found` for unknown cards, `permission_denied` for cards not in use */
export async function clockAtStation(deps: AttendanceDeps, input: { scan: CardScan; station: string }): Promise<{ event: ClockEvent; staff: StaffRef }> {
  // 1. Which card, and is it in use?
  const card = await deps.cards.resolve(input.scan);
  if (!card) throw new AppError("not_found", "This card is not registered. Send the person to HR.");
  if (card.status !== "active" || !card.staffId) throw new AppError("permission_denied", `Card ${card.cardNumber} is ${card.status === "lost" ? "reported lost" : "not in use"}. Keep it and call security.`);
  // 2. Who holds it?
  const staff = await deps.staff.byId(card.staffId);
  if (!staff) throw new AppError("not_found", "The holder of this card was not found.");
  // 3. Clock them.
  const event = await recordClock(deps, { staff, method: input.scan.uid ? "nfc" : "qr", station: input.station });
  return { event, staff };
}
