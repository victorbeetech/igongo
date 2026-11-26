// The hand-made web pages of module 64 (Tables & Dine-in), live from the API
// through the shared booking pages (the same engine as the API's bookings kit).

import { BookPage } from "@/shared/bookings/presentation/BookPage";
import { BookingSettingsPage } from "@/shared/bookings/presentation/BookingSettingsPage";
import { StaffBookingsPage } from "@/shared/bookings/presentation/StaffBookingsPage";
import type { ScreenOverrides } from "@/shared/catalog/types";
import { KINDS, PLACE } from "./domain/place";

/** Module 64's hand-made web pages. */
export const m64Overrides: ScreenOverrides = {
  "S64-04": (s) => <BookPage screen={s} place={PLACE} />,
  "S64-01": (s) => <StaffBookingsPage screen={s} place={PLACE} />,
  "S64-03": (s) => <StaffBookingsPage screen={s} place={PLACE} allDays />,
  "S64-02": (s) => <BookingSettingsPage screen={s} place={PLACE} kinds={KINDS} />,
};
