// The hand-made web pages of module 85 (Booking Calendar). S85-02 is the super
// admin's calendar settings, live from the API. S85-01 is the guest calendar,
// which is the app's screen and has no web page.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { BookingCalendarSettingsPage } from "./presentation/BookingCalendarSettingsPage";

/** Module 85's hand-made web pages. */
export const m85Overrides: ScreenOverrides = {
  "S85-02": (screen) => <BookingCalendarSettingsPage screen={screen} />,
};
