"use client";
// Whether the wide-screen sidebar is open or folded to icons. Open by
// default; the choice is remembered in this browser (a convenience only, so
// a blocked storage simply means it opens every time).

import { useCallback, useSyncExternalStore } from "react";

const KEY = "igongo.sidebar";
const listeners = new Set<() => void>();
// The choice in memory, so the toggle works even when storage is blocked.
let current: boolean | null = null;

/** The current choice: in memory, else saved, else open. */
function read(): boolean {
  if (current !== null) return current;
  try {
    return window.localStorage.getItem(KEY) !== "closed";
  } catch {
    return true;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** [open, setOpen] for the sidebar, shared by every part that needs it. */
export function useSidebarOpen(): [boolean, (open: boolean) => void] {
  const open = useSyncExternalStore(subscribe, read, () => true);
  const setOpen = useCallback((value: boolean) => {
    current = value;
    try {
      window.localStorage.setItem(KEY, value ? "open" : "closed");
    } catch {
      // Storage blocked: the choice lasts until the page reloads.
    }
    listeners.forEach((l) => l());
  }, []);
  return [open, setOpen];
}
