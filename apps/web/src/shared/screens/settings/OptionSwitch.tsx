"use client";
// One labelled on/off switch that remembers its own position while the page is open.

import { useState } from "react";

/** A setting with a switch. */
export function OptionSwitch({ label, hint, initial }: { label: string; hint: string; initial: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <div className="flex min-h-14 items-center gap-3 border-b border-line px-4 py-2 last:border-b-0">
      <span className="flex-1">
        <span className="block text-subtitle font-bold">{label}</span>
        <span className="block text-caption text-muted">{hint}</span>
      </span>
      {/* A real switch for screen readers, drawn in brand red when on. */}
      <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => setOn(!on)} className={`relative h-7 w-12 rounded-full transition-colors ${on ? "bg-primary" : "bg-line"}`}>
        <span className={`absolute top-1 size-5 rounded-full bg-surface shadow transition-all ${on ? "left-6" : "left-1"}`} />
      </button>
    </div>
  );
}
