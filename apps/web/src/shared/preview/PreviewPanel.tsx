"use client";
// The preview panel for reviewing the prototype: pick the screen state, the
// theme, the text size and the role. It goes away when real data arrives.

import { X } from "lucide-react";
import { catalog } from "@/shared/catalog/catalogIndex";
import { setPreferences, usePreferences } from "@/shared/preferences/usePreferences";
import type { ThemeChoice } from "@/shared/preferences/preferences";
import { TEXT_SIZES } from "@/shared/preferences/textSizes";
import { VIEW_STATES, type ViewState } from "@/shared/states/viewState";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";

const THEMES: [ThemeChoice, string][] = [["light", "Light"], ["dark", "Dark"], ["system", "Follow the device"]];

/** A row of choice chips. */
function Choices<T extends string>({ values, current, pick }: { values: [T, string][]; current: T; pick: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-2 px-4">
      {values.map(([v, label]) => (
        <button key={v} type="button" aria-pressed={v === current} onClick={() => pick(v)}
          className={`rounded-full border px-3 py-1 text-label ${v === current ? "border-primary bg-primary-container font-bold text-on-primary-container" : "border-line"}`}>
          {label}
        </button>
      ))}
    </div>
  );
}

/** The preview panel, as a side sheet. */
export function PreviewPanel({ onClose }: { onClose: () => void }) {
  const prefs = usePreferences();
  return (
    <div role="dialog" aria-label="Preview" className="fixed inset-y-0 right-0 z-40 w-full max-w-sm overflow-y-auto border-l border-line bg-surface pb-8 shadow-2xl">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-title font-bold">Preview</h2>
        <button type="button" aria-label="Close" onClick={onClose}><X /></button>
      </div>
      {/* Step 1: the state every page shows. */}
      <SectionHeader title="Screen state" />
      <Choices values={Object.entries(VIEW_STATES) as [ViewState, string][]} current={prefs.state} pick={(state) => setPreferences({ state })} />
      {/* Step 2: the theme. */}
      <SectionHeader title="Theme" />
      <Choices values={THEMES} current={prefs.theme} pick={(theme) => setPreferences({ theme })} />
      {/* Step 3: the text size. */}
      <SectionHeader title="Text size" />
      <Choices values={TEXT_SIZES.map((t) => [t.key, t.label] as [typeof t.key, string])} current={prefs.textSize} pick={(textSize) => setPreferences({ textSize })} />
      {/* Step 4: the role, which changes the home tiles and the menu. */}
      <SectionHeader title="Role" />
      <label className="block px-4">
        <span className="sr-only">Role</span>
        <select value={prefs.role} onChange={(e) => setPreferences({ role: e.target.value })} className="min-h-11 w-full rounded-md border border-outline bg-surface-alt px-3 text-body">
          {catalog.roles.map((r) => <option key={r.key} value={r.key}>{r.name} · {r.level}</option>)}
        </select>
      </label>
    </div>
  );
}
