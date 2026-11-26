// The hand-made web pages of module 68 (Museum), live from the API
// through the shared booking pages (the same engine as the API's bookings kit).

import { BookPage } from "@/shared/bookings/presentation/BookPage";
import { BookingSettingsPage } from "@/shared/bookings/presentation/BookingSettingsPage";
import { MyBookingsPage } from "@/shared/bookings/presentation/MyBookingsPage";
import { StaffBookingsPage } from "@/shared/bookings/presentation/StaffBookingsPage";
import type { ScreenOverrides } from "@/shared/catalog/types";
import { KINDS, PLACE } from "./domain/place";

/** Module 68's hand-made web pages. */
export const m68Overrides: ScreenOverrides = {
  "S68-01": (s) => <BookPage screen={s} place={PLACE} />,
  "S68-02": (s) => <BookPage screen={s} place={PLACE} />,
  "S68-03": (s) => <BookPage screen={s} place={PLACE} />,
  "S68-09": (s) => <BookPage screen={s} place={PLACE} />,
  "S68-05": (s) => <MyBookingsPage screen={s} place={PLACE} />,
  "S68-06": (s) => <StaffBookingsPage screen={s} place={PLACE} />,
  "S68-10": (s) => <StaffBookingsPage screen={s} place={PLACE} />,
  "S68-12": (s) => <BookingSettingsPage screen={s} place={PLACE} kinds={KINDS} />,
};
