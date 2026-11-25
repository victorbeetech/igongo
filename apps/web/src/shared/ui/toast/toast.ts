"use client";
// Toasts: the short message at the bottom after an action, such as "Saved".
// A tiny store so any component can show one.

let message: string | null = null;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setTimeout> | undefined;

/** Shows [text] for four seconds, replacing any toast already showing. */
export function showToast(text: string): void {
  message = text;
  listeners.forEach((l) => l());
  clearTimeout(timer);
  timer = setTimeout(() => {
    message = null;
    listeners.forEach((l) => l());
  }, 4000);
}

/** The toast store, read by the Toaster. */
export const toastStore = {
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  read: () => message,
};
