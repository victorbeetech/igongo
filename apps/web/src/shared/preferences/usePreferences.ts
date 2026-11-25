"use client";
// The hook every component uses to read and change preferences. One shared
// store, so a change in Settings redraws every screen at once.

import { useSyncExternalStore } from "react";
import { applyPreferences, DEFAULT_PREFERENCES, loadPreferences, savePreferences, type Preferences } from "./preferences";

// Step 1: the store: the current value and who is listening.
let current: Preferences | null = null;
const listeners = new Set<() => void>();

function read(): Preferences {
  current ??= loadPreferences();
  return current;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Changes some preferences, saves them, applies them and tells every listener. */
export function setPreferences(change: Partial<Preferences>): void {
  current = { ...read(), ...change };
  savePreferences(current);
  applyPreferences(current);
  listeners.forEach((l) => l());
}

/** The current preferences; the server render uses the defaults. */
export function usePreferences(): Preferences {
  return useSyncExternalStore(subscribe, read, () => DEFAULT_PREFERENCES);
}
