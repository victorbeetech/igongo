"use client";
// S85-02 Booking calendar settings (super admin): the on/off switch, the
// weekdays the hotel takes bookings, what counts as Spots full, and how far
// ahead guests can see. Saving changes what guests see at once, with no code
// change. The API checks every value, so a bad one is refused with its reason.

import { useState } from "react";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { TextInput } from "@/shared/ui/field/TextInput";
import { ToggleChips } from "@/shared/ui/chip/ToggleChips";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";
import { type CalendarSettings, type FullRule, useCalendarSettings, useSaveCalendarSettings } from "../data/calendarSettingsApi";

/** Weekday names, Sunday first, the same order as the API's numbers 0 to 6. */
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** The two ways a day can be Spots full, in words for the super admin. */
const FULL_RULE_OPTIONS: [FullRule, string][] = [
  ["every_offering", "Only when every room is taken"],
  ["any_offering", "As soon as one room is taken"],
];

/** The calendar settings page: loads the settings, then shows the form. */
export function BookingCalendarSettingsPage({ screen }: { screen: ScreenContext }) {
  const settings = useCalendarSettings();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <LiveData query={settings} name={screen.spec.name}>
        {(saved) => <SettingsForm initial={saved} />}
      </LiveData>
    </>
  );
}

/** The form. The weekdays are kept as numbers; the rest are typed in as they are. */
function SettingsForm({ initial }: { initial: CalendarSettings }) {
  const [values, setValues] = useState(initial);
  const save = useSaveCalendarSettings();

  // Step 1: the weekday chips show names; the saved values are the API's numbers, so convert both ways.
  const pickedWeekdays = values.openWeekdays.map((n) => WEEKDAYS[n]).filter((d): d is string => d !== undefined);
  const setWeekdays = (names: string[]) => setValues({ ...values, openWeekdays: names.map((n) => WEEKDAYS.indexOf(n)).sort((a, b) => a - b) });

  return (
    <div className="grid gap-4 p-4">
      <section className="grid gap-3 rounded-md border border-line bg-surface p-3">
        <SectionHeader title="Calendar for guests" />
        <SwitchRow
          label="Show the booking calendar to guests"
          hint="When off, guests see no calendar at all."
          on={values.enabled}
          onChange={(on) => setValues({ ...values, enabled: on })}
        />
      </section>
      <section className="grid gap-3 rounded-md border border-line bg-surface p-3">
        <SectionHeader title="Days the hotel takes bookings" />
        <ToggleChips label="Open weekdays" options={WEEKDAYS} picked={pickedWeekdays} onChange={setWeekdays} />
        <p className="text-label">A weekday that is off shows as closed to guests.</p>
      </section>
      <section className="grid gap-3 rounded-md border border-line bg-surface p-3">
        <SectionHeader title="When a day is Spots full" />
        <SelectInput
          label="A day is Spots full"
          value={values.fullRule}
          options={FULL_RULE_OPTIONS}
          onChange={(rule) => setValues({ ...values, fullRule: rule as FullRule })}
        />
        <TextInput
          label="How many days ahead guests can see"
          type="number"
          hint="From 1 to 365 days."
          value={String(values.windowDays)}
          onChange={(text) => setValues({ ...values, windowDays: Number(text) })}
        />
        <Button onClick={() => save.mutate(values)} disabled={save.isPending}>
          Save calendar settings
        </Button>
      </section>
    </div>
  );
}
