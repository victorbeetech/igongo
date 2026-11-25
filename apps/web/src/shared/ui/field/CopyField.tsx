"use client";
// A read-only value with a Copy button, such as the webhook address to paste
// into a provider's dashboard.

import { Copy } from "lucide-react";
import { showToast } from "@/shared/ui/toast/toast";

/** Shows [value] under [label], with a button that copies it. */
export function CopyField({ label, value }: { label: string; value: string }) {
  // Copy, and say so; if the browser refuses, the value is still selectable.
  const copy = () => navigator.clipboard?.writeText(value).then(() => showToast("Copied"), () => showToast("Select the address and copy it"));
  return (
    <div className="grid gap-1">
      <span className="text-label font-bold">{label}</span>
      <span className="flex min-h-11 items-center rounded-md border border-line bg-surface">
        <code className="min-w-0 flex-1 truncate px-3 text-label select-all">{value}</code>
        <button type="button" onClick={copy} aria-label={`Copy ${label}`} className="inline-flex size-11 shrink-0 items-center justify-center text-muted hover:text-ink"><Copy size={18} /></button>
      </span>
    </div>
  );
}
