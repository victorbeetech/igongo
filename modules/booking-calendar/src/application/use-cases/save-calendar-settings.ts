/**
 * Use case: the super admin saves calendar settings. Only the fields sent are
 * changed; the rest keep their saved values. Steps:
 *   1. read the saved settings (with defaults);
 *   2. merge in the fields the super admin changed;
 *   3. save them with who changed them and when.
 */

import type { ChangeContext } from "@igongo/core";
import type { CalendarSettings } from "../../domain/calendar-settings";
import type { CalendarSettingsStore } from "../ports/calendar-settings-store";

/** Deps for saving: the settings store and the change context (clock and actor). */
export interface SaveCalendarSettingsDeps {
  settings: CalendarSettingsStore;
  change: ChangeContext;
}

/** Saves [changes] over the current settings and returns the result. */
export async function saveCalendarSettings(
  d: SaveCalendarSettingsDeps,
  changes: Partial<CalendarSettings>,
  by: string | null,
): Promise<CalendarSettings> {
  // 1. What is saved now (defaults fill anything never saved).
  const current = await d.settings.read();
  // 2. Only the fields the super admin changed are replaced.
  const next: CalendarSettings = { ...current, ...changes };
  // 3. Save with the change record.
  await d.settings.write(next, by, d.change.now);
  return next;
}
