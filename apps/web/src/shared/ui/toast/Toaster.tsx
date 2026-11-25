"use client";
// Shows the current toast at the bottom of the page, announced to screen readers.

import { useSyncExternalStore } from "react";
import { toastStore } from "./toast";

/** The place toasts appear. Put one in the root layout. */
export function Toaster() {
  const message = useSyncExternalStore(toastStore.subscribe, toastStore.read, () => null);
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      {message && <div className="rounded-md bg-secondary px-4 py-2 text-body text-page shadow-lg">{message}</div>}
    </div>
  );
}
