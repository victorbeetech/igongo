/**
 * Use case: how many units of an offering are left for the wanted dates or
 * slot. Shared by the availability screen and by booking. Steps:
 *   1. the dates and slot must fit the offering's kind,
 *   2. stock offerings: what is on the shelf;
 *      others: capacity minus what clashing bookings hold.
 */

import { AppError, hotelDate } from "@igongo/core";
import { nightsBetween } from "../../domain/booking-math";
import type { Offering } from "../../domain/offering";
import type { BookingsDeps } from "../bookings-deps";

export interface WantedTime {
  date?: string;
  endDate?: string;
  slot?: string;
}

/** Step 1. @throws AppError when the dates or slot do not fit [offering] */
export function checkTime(offering: Offering, t: WantedTime, today: string): { date: string | null; endDate: string | null; slot: string | null; nights: number } {
  if (offering.kind === "stock") return { date: null, endDate: null, slot: null, nights: 0 };
  const date = offering.onDate ?? t.date;
  if (!date) throw new AppError("bad_request", "Choose a date.");
  if (date < today) throw new AppError("bad_request", "That date has passed.");
  if (offering.onDate && t.date && t.date !== offering.onDate) throw new AppError("bad_request", `${offering.name} is on ${offering.onDate} only.`);
  if (offering.kind === "nights") {
    if (!t.endDate || nightsBetween(date, t.endDate) < 1) throw new AppError("bad_request", "Check-out must be after check-in.");
    return { date, endDate: t.endDate, slot: null, nights: nightsBetween(date, t.endDate) };
  }
  if (offering.kind === "slot" && offering.slots.length) {
    if (!t.slot || !offering.slots.includes(t.slot)) throw new AppError("bad_request", `Choose a time: ${offering.slots.join(", ")}.`);
    return { date, endDate: null, slot: t.slot, nights: 0 };
  }
  return { date, endDate: null, slot: null, nights: 0 };
}

/** Units left of [offering] at [t] (enquiries have no limit). */
export async function unitsLeft(deps: BookingsDeps, offering: Offering, t: WantedTime): Promise<number> {
  const time = checkTime(offering, t, hotelDate(deps.change.now));
  if (offering.kind === "enquiry") return Number.MAX_SAFE_INTEGER;
  if (offering.kind === "stock") return offering.capacity;
  const taken = await deps.bookings.unitsTaken({ offeringId: offering.id, date: time.date ?? "", endDate: time.endDate, slot: time.slot });
  return Math.max(0, offering.capacity - taken);
}
