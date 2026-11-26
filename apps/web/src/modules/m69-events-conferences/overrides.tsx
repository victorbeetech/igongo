// The hand-made web pages of module 69 (Events & Conferences), live from the API
// through the shared booking pages (the same engine as the API's bookings kit).

import { BookPage } from "@/shared/bookings/presentation/BookPage";
import { MyBookingsPage } from "@/shared/bookings/presentation/MyBookingsPage";
import { StaffBookingsPage } from "@/shared/bookings/presentation/StaffBookingsPage";
import type { ScreenOverrides } from "@/shared/catalog/types";
import { PLACE } from "./domain/place";

/** Module 69's hand-made web pages. */
export const m69Overrides: ScreenOverrides = {
  "S69-01": (s) => <BookPage screen={s} place={PLACE} />,
  "S69-02": (s) => <BookPage screen={s} place={PLACE} />,
  "S69-12": (s) => <MyBookingsPage screen={s} place={PLACE} />,
  "S69-03": (s) => <StaffBookingsPage screen={s} place={PLACE} allDays />,
  "S69-04": (s) => <StaffBookingsPage screen={s} place={PLACE} allDays />,
  "S69-10": (s) => <StaffBookingsPage screen={s} place={PLACE} />,
};
