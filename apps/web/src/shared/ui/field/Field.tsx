// The one text field used in every form: the label above the box.

import { useId } from "react";

/** A labelled text field with sample text. */
export function Field({ label, hint, type = "text" }: { label: string; hint?: string; type?: string }) {
  // The label is tied to its box for screen readers.
  const id = useId();
  return (
    <label htmlFor={id} className="grid gap-1">
      <span className="text-label font-bold">{label}</span>
      <input id={id} type={type} placeholder={hint ?? label} className="min-h-11 rounded-md border border-outline bg-surface-alt px-3 text-body outline-none focus:border-primary-text focus:ring-2 focus:ring-primary-text/30" />
    </label>
  );
}
