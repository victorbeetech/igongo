// The hand-made web pages of module 71 (Pool), live from the API
// through the shared booking pages (the same engine as the API's bookings kit).

import { BookPage } from "@/shared/bookings/presentation/BookPage";
import { BookingSettingsPage } from "@/shared/bookings/presentation/BookingSettingsPage";
import { StaffBookingsPage } from "@/shared/bookings/presentation/StaffBookingsPage";
import type { ScreenOverrides } from "@/shared/catalog/types";
import { KINDS, PLACE } from "./domain/place";

/** Module 71's hand-made web pages. */
export const m71Overrides: ScreenOverrides = {
  "S71-01": (s) => <BookPage screen={s} place={PLACE} />,
  "S71-02": (s) => <BookPage screen={s} place={PLACE} />,
  "S71-07": (s) => <BookPage screen={s} place={PLACE} />,
  "S71-03": (s) => <StaffBookingsPage screen={s} place={PLACE} />,
  "S71-04": (s) => <StaffBookingsPage screen={s} place={PLACE} />,
  "S71-08": (s) => <BookingSettingsPage screen={s} place={PLACE} kinds={KINDS} />,
};
