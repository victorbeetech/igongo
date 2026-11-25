// The person's display choices (theme, text size) and, in this prototype, the
// preview choices (role, screen state). Kept in a tiny store saved in the
// browser; it moves to the real data layer in Phase 7.

import type { ViewState } from "@/shared/states/viewState";
import { TEXT_SIZES, type TextSize } from "./textSizes";

/** Light, dark or follow the device. */
export type ThemeChoice = "system" | "light" | "dark";

/** Every preference the portal reads. */
export interface Preferences {
  /** The theme. */
  theme: ThemeChoice;
  /** The text size key. */
  textSize: TextSize["key"];
  /** The role whose home and menu show. */
  role: string;
  /** The state every screen shows (preview only). */
  state: ViewState;
}

/** The choices before the person changes anything. */
export const DEFAULT_PREFERENCES: Preferences = { theme: "system", textSize: "standard", role: "super-admin", state: "normal" };

const KEY = "igongo.preferences";

/** Reads saved preferences, or the defaults when storage is empty or blocked. */
export function loadPreferences(): Preferences {
  try {
    const saved = window.localStorage.getItem(KEY);
    return saved ? { ...DEFAULT_PREFERENCES, ...(JSON.parse(saved) as Partial<Preferences>) } : DEFAULT_PREFERENCES;
  } catch {
    // Private windows can block storage; the defaults still work.
    return DEFAULT_PREFERENCES;
  }
}

/** Saves preferences, ignoring storage that is blocked. */
export function savePreferences(p: Preferences): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // Nothing to do: the choice still applies until the page closes.
  }
}

/** Applies the theme and text size to the page, so CSS variables switch at once. */
export function applyPreferences(p: Preferences): void {
  const root = document.documentElement;
  // "system" removes the attribute, so the CSS follows the device setting.
  if (p.theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", p.theme);
  const size = TEXT_SIZES.find((t) => t.key === p.textSize) ?? TEXT_SIZES[1]!;
  root.style.setProperty("--text-scale", String(size.scale));
}
