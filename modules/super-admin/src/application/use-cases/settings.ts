/**
 * Use cases for settings sections (hotel profile, branding, regional): read
 * with defaults, and save after checking against the section's rules.
 */

import { AppError, recordChange, type ChangeContext } from "@igongo/core";
import { SETTINGS_DEFAULTS, SETTINGS_SECTIONS, type SettingsSection } from "../../domain/settings-sections";
import type { ConsoleStore } from "../ports/console-store";

/** A section's saved value merged over its defaults. */
export async function readSection(store: ConsoleStore, name: SettingsSection): Promise<Record<string, unknown>> {
  return { ...SETTINGS_DEFAULTS[name], ...((await store.section(name)) as Record<string, unknown> | null) };
}

/** Saves part of a section; the merged result must pass the section's rules. */
export async function updateSection(store: ConsoleStore, ctx: ChangeContext, name: SettingsSection, patch: Record<string, unknown>): Promise<Record<string, unknown>> {
  const before = await readSection(store, name);
  const checked = SETTINGS_SECTIONS[name].safeParse({ ...before, ...patch });
  if (!checked.success) throw new AppError("bad_request", checked.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "));
  await store.saveSection(name, checked.data, ctx.actorId);
  await recordChange(ctx, {
    action: "settings.changed",
    module: "super-admin",
    recordType: "settings",
    recordId: name,
    summary: `Changed the ${name} settings`,
    changes: Object.fromEntries(Object.keys(patch).map((k) => [k, { old: before[k], new: (checked.data as Record<string, unknown>)[k] }])),
  });
  return checked.data as Record<string, unknown>;
}
