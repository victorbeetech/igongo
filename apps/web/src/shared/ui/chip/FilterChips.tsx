"use client";
// A row of filter chips, such as All, New, Read: one is picked at a time.
// Real buttons with aria-pressed, so screen readers say which is on, and
// each at least 44 pixels tall, the touch target size.

import { useState } from "react";

/** The chips for [options]; the first starts picked. */
export function FilterChips({ options, label }: { options: string[]; label: string }) {
  const [picked, setPicked] = useState(options[0]);
  return (
    <div role="group" aria-label={label} className="flex gap-2 overflow-x-auto px-4 pb-3">
      {options.map((o) => (
        <button key={o} type="button" aria-pressed={o === picked} onClick={() => setPicked(o)}
          className={`min-h-11 shrink-0 rounded-full border px-3 text-label ${o === picked ? "border-primary bg-primary-container font-bold text-on-primary-container" : "border-outline hover:bg-surface-alt"}`}>
          {o}
        </button>
      ))}
    </div>
  );
}
