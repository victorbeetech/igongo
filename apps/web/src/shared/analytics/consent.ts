"use client";
// Remembers whether the visitor agreed to analytics and marketing cookies.
// Nothing that tracks people loads until they say yes.

import { useSyncExternalStore } from "react";

/** The visitor's answer: not asked yet, yes or no. */
export type Consent = "unknown" | "granted" | "denied";

const KEY = "igongo.consent";
const listeners = new Set<() => void>();

// Reads the saved answer; blocked storage counts as not asked.
function read(): Consent {
  try {
    return (window.localStorage.getItem(KEY) as Consent | null) ?? "unknown";
  } catch {
    return "unknown";
  }
}

/** Saves the visitor's answer and tells the page. */
export function setConsent(value: Consent): void {
  try {
    window.localStorage.setItem(KEY, value);
  } catch {
    // The answer still applies until the page closes.
  }
  listeners.forEach((l) => l());
}

/** The visitor's answer; the server render treats it as granted so the banner never flashes. */
export function useConsent(): Consent {
  return useSyncExternalStore((l) => (listeners.add(l), () => listeners.delete(l)), read, () => "granted");
}
