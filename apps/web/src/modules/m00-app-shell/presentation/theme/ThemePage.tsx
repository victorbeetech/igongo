"use client";
// S00-34 Theme setting on the web: light, dark or follow the device. Igongo
// red stays the same in every choice; only background, text and borders change.

import { CheckCircle2 } from "lucide-react";
import { tokens } from "@igongo/design-tokens/tokens";
import type { ScreenContext } from "@/shared/catalog/types";
import type { ThemeChoice } from "@/shared/preferences/preferences";
import { setPreferences, usePreferences } from "@/shared/preferences/usePreferences";
import { PurposeText } from "@/shared/screens/parts/PurposeText";

// Each choice, with the palette its thumbnail shows (follow the device shows both halves).
const CHOICES: { value: ThemeChoice; label: string; palettes: (typeof tokens.color.light | typeof tokens.color.dark)[] }[] = [
  { value: "light", label: "Light", palettes: [tokens.color.light] },
  { value: "dark", label: "Dark", palettes: [tokens.color.dark] },
  { value: "system", label: "Follow the device", palettes: [tokens.color.light, tokens.color.dark] },
];

/** The theme setting. */
export function ThemePage({ screen }: { screen: ScreenContext }) {
  const prefs = usePreferences();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid max-w-3xl gap-3 p-4 sm:grid-cols-3">
        {CHOICES.map((c) => (
          <button key={c.value} type="button" aria-pressed={prefs.theme === c.value} onClick={() => setPreferences({ theme: c.value })}
            className={`grid gap-2 rounded-md border p-3 text-left ${prefs.theme === c.value ? "border-primary bg-primary-container" : "border-line bg-surface"}`}>
            {/* The thumbnail: the same red bar on each mode's background, drawn from the tokens. */}
            <span className="flex h-20 overflow-hidden rounded-sm border border-line">
              {c.palettes.map((p, i) => (
                <span key={i} className="flex-1" style={{ background: p.background }}>
                  <span className="block h-4" style={{ background: p.primary }} />
                  <span className="mx-2 mt-2 block h-1.5 rounded" style={{ background: p.textMuted }} />
                  <span className="mx-2 mt-1.5 block h-1.5 w-1/2 rounded" style={{ background: p.textMuted }} />
                </span>
              ))}
            </span>
            <span className="flex items-center justify-between text-subtitle font-bold">
              {c.label}
              {prefs.theme === c.value && <CheckCircle2 size={18} className="text-primary-text" />}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
