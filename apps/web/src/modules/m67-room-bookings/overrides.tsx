// The hand-made web pages of module 67 (Room Bookings), live from the API
// through the shared booking pages (the same engine as the API's bookings kit).

import { BookPage } from "@/shared/bookings/presentation/BookPage";
import { BookingSettingsPage } from "@/shared/bookings/presentation/BookingSettingsPage";
import { MyBookingsPage } from "@/shared/bookings/presentation/MyBookingsPage";
import { StaffBookingsPage } from "@/shared/bookings/presentation/StaffBookingsPage";
import type { ScreenOverrides } from "@/shared/catalog/types";
import { KINDS, PLACE } from "./domain/place";

/** Module 67's hand-made web pages. */
export const m67Overrides: ScreenOverrides = {
  "S67-01": (s) => <BookPage screen={s} place={PLACE} />,
  "S67-02": (s) => <BookPage screen={s} place={PLACE} />,
  "S67-03": (s) => <BookPage screen={s} place={PLACE} />,
  "S67-04": (s) => <BookPage screen={s} place={PLACE} />,
  "S67-06": (s) => <MyBookingsPage screen={s} place={PLACE} />,
  "S67-10": (s) => <StaffBookingsPage screen={s} place={PLACE} allDays />,
  "S67-11": (s) => <StaffBookingsPage screen={s} place={PLACE} />,
  "S67-12": (s) => <StaffBookingsPage screen={s} place={PLACE} />,
  "S67-13": (s) => <BookingSettingsPage screen={s} place={PLACE} kinds={KINDS} />,
  "S67-14": (s) => <BookingSettingsPage screen={s} place={PLACE} kinds={KINDS} />,
};
