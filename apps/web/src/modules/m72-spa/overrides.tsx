// The hand-made web pages of module 72 (Spa / Humura), live from the API
// through the shared booking pages (the same engine as the API's bookings kit).

import { BookPage } from "@/shared/bookings/presentation/BookPage";
import { MyBookingsPage } from "@/shared/bookings/presentation/MyBookingsPage";
import { StaffBookingsPage } from "@/shared/bookings/presentation/StaffBookingsPage";
import type { ScreenOverrides } from "@/shared/catalog/types";
import { PLACE } from "./domain/place";

/** Module 72's hand-made web pages. */
export const m72Overrides: ScreenOverrides = {
  "S72-01": (s) => <BookPage screen={s} place={PLACE} />,
  "S72-02": (s) => <BookPage screen={s} place={PLACE} />,
  "S72-03": (s) => <BookPage screen={s} place={PLACE} />,
  "S72-05": (s) => <MyBookingsPage screen={s} place={PLACE} />,
  "S72-06": (s) => <StaffBookingsPage screen={s} place={PLACE} allDays />,
  "S72-07": (s) => <StaffBookingsPage screen={s} place={PLACE} />,
};
