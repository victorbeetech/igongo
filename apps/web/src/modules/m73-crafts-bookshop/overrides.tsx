// The hand-made web pages of module 73 (Crafts & Bookshop), live from the API
// through the shared booking pages (the same engine as the API's bookings kit).

import { BookPage } from "@/shared/bookings/presentation/BookPage";
import { BookingSettingsPage } from "@/shared/bookings/presentation/BookingSettingsPage";
import { MyBookingsPage } from "@/shared/bookings/presentation/MyBookingsPage";
import { StaffBookingsPage } from "@/shared/bookings/presentation/StaffBookingsPage";
import type { ScreenOverrides } from "@/shared/catalog/types";
import { KINDS, PLACE } from "./domain/place";

/** Module 73's hand-made web pages. */
export const m73Overrides: ScreenOverrides = {
  "S73-01": (s) => <BookPage screen={s} place={PLACE} />,
  "S73-02": (s) => <BookPage screen={s} place={PLACE} />,
  "S73-03": (s) => <MyBookingsPage screen={s} place={PLACE} />,
  "S73-04": (s) => <StaffBookingsPage screen={s} place={PLACE} allDays />,
  "S73-05": (s) => <BookingSettingsPage screen={s} place={PLACE} kinds={KINDS} />,
  "S73-08": (s) => <BookingSettingsPage screen={s} place={PLACE} kinds={KINDS} />,
};
