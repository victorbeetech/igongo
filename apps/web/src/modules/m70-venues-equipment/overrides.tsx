// The hand-made web pages of module 70 (Venues & Equipment), live from the API
// through the shared booking pages (the same engine as the API's bookings kit).

import { BookPage } from "@/shared/bookings/presentation/BookPage";
import { BookingSettingsPage } from "@/shared/bookings/presentation/BookingSettingsPage";
import { StaffBookingsPage } from "@/shared/bookings/presentation/StaffBookingsPage";
import type { ScreenOverrides } from "@/shared/catalog/types";
import { KINDS, PLACE } from "./domain/place";

/** Module 70's hand-made web pages. */
export const m70Overrides: ScreenOverrides = {
  "S70-01": (s) => <BookPage screen={s} place={PLACE} />,
  "S70-04": (s) => <BookPage screen={s} place={PLACE} />,
  "S70-02": (s) => <StaffBookingsPage screen={s} place={PLACE} allDays />,
  "S70-03": (s) => <BookingSettingsPage screen={s} place={PLACE} kinds={KINDS} />,
  "S70-05": (s) => <BookingSettingsPage screen={s} place={PLACE} kinds={KINDS} />,
};
