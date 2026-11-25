"use client";
// A field for a key or secret: hidden as dots, with a button to show it while
// typing. Used wherever the super admin pastes an API key.

import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";

/** A labelled secret field with a show and hide button. */
export function SecretField({ label, hint }: { label: string; hint?: string }) {
  const id = useId();
  const [shown, setShown] = useState(false);
  return (
    <label htmlFor={id} className="grid gap-1">
      <span className="text-label font-bold">{label}</span>
      <span className="flex min-h-11 items-center rounded-md border border-outline bg-surface-alt focus-within:border-primary-text focus-within:ring-2 focus-within:ring-primary-text/30">
        <input id={id} type={shown ? "text" : "password"} placeholder={hint ?? label} autoComplete="off" spellCheck={false}
          className="min-w-0 flex-1 bg-transparent px-3 text-body outline-none" />
        <button type="button" onClick={() => setShown(!shown)} aria-label={shown ? `Hide ${label}` : `Show ${label}`}
          className="inline-flex size-11 shrink-0 items-center justify-center text-muted hover:text-ink">
          {shown ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </span>
    </label>
  );
}
