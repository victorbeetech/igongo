// Module 85: Booking Calendar. Its screens: S85-01 the guest calendar (app) and
// S85-02 the super admin's calendar settings (web). Written by hand here, in the
// same shape the generator writes, and listed in the catalogue by catalog.g.ts.
// The module has no sample data: its pages read the live API.

import type { ModuleSpec } from "@/shared/catalog/types";

/** Module 85, Booking Calendar: its screens, with no dialogs and no sample data. */
export const m85BookingCalendar: ModuleSpec = {
  code: "85",
  name: "Booking Calendar",
  slug: "booking-calendar",
  screens: [
    {
      id: "S85-01",
      name: "Booking calendar",
      purpose: "Spots by day and room: open, Spots full or closed",
      route: "/booking-calendar/booking-calendar",
      kind: "list",
      surfaces: ["app"],
      opens: [],
      dialogs: [],
      fields: [],
    },
    {
      id: "S85-02",
      name: "Booking calendar settings",
      purpose: "Show the calendar to guests; open weekdays; when a day is Spots full; how far ahead guests can see",
      route: "/booking-calendar/booking-calendar-settings",
      kind: "settings",
      surfaces: ["web"],
      opens: [],
      dialogs: [],
      fields: [],
    },
  ],
  dialogs: [],
  mock: { items: [], statuses: [], kpis: [], fields: [] },
};
