"use client";
// The preview panel for the super admin, opened from the foot of the sidebar.
// It is empty for now; the presets and the per-role preview are planned in
// docs/PLAN-presets-and-role-preview.md.

import { X } from "lucide-react";

/** The preview panel, as a side sheet. */
export function PreviewPanel({ onClose }: { onClose: () => void }) {
  return (
    <div role="dialog" aria-label="Preview" className="fixed inset-y-0 right-0 z-40 w-full max-w-sm overflow-y-auto border-l border-line bg-surface pb-8 shadow-2xl">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-title font-bold">Preview</h2>
        <button type="button" aria-label="Close" onClick={onClose}><X /></button>
      </div>
    </div>
  );
}
