"use client";
// The preview panel for the super admin, opened from the foot of the sidebar.
// It holds only the link to the design system; the screen state, theme, text
// size and role controls were removed on the super admin's request.

import { X } from "lucide-react";
import Link from "next/link";

/** The preview panel, as a side sheet. */
export function PreviewPanel({ onClose }: { onClose: () => void }) {
  return (
    <div role="dialog" aria-label="Preview" className="fixed inset-y-0 right-0 z-40 w-full max-w-sm overflow-y-auto border-l border-line bg-surface pb-8 shadow-2xl">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-title font-bold">Preview</h2>
        <button type="button" aria-label="Close" onClick={onClose}><X /></button>
      </div>
      {/* The design system showcase: every token and component on one page. */}
      <Link href="/design-system" className="mx-4 mb-2 flex min-h-11 items-center rounded-md border border-outline px-3 text-label font-bold">Open the design system</Link>
    </div>
  );
}
