"use client";
// Pick photos and upload them straight away; shows a thumbnail of each one
// and lets the person take one off before saving the form.

import { useState } from "react";
import { ApiError } from "@/shared/api/ApiError";
import { showToast } from "@/shared/ui/toast/toast";
import { fileUrl, uploadPhoto } from "./uploadPhoto";

interface PhotoPickerProps {
  /** The module the photos are for, such as `faults-maintenance`. */
  purpose: string;
  /** The uploaded photo IDs. */
  value: string[];
  onChange: (ids: string[]) => void;
  /** The most photos allowed. */
  max?: number;
  label?: string;
}

/** A photo field: choose, upload, preview, remove. */
export function PhotoPicker({ purpose, value, onChange, max = 5, label = "Photos" }: PhotoPickerProps) {
  const [busy, setBusy] = useState(false);
  async function add(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      // Upload one by one, so a refused photo doesn't lose the others.
      const ids = [...value];
      for (const file of [...files].slice(0, max - value.length)) ids.push(await uploadPhoto(file, purpose));
      onChange(ids);
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : "The photo could not be uploaded.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="grid gap-2">
      <span className="text-caption font-bold text-muted">{label}</span>
      <div className="flex flex-wrap gap-2">
        {value.map((id) => (
          <button key={id} type="button" onClick={() => onChange(value.filter((v) => v !== id))} className="relative" aria-label="Remove photo">
            {/* eslint-disable-next-line @next/next/no-img-element -- photos come from the API with the session cookie */}
            <img src={fileUrl(id)} alt="" className="size-20 rounded-md border border-line object-cover" />
          </button>
        ))}
      </div>
      {value.length < max && <input type="file" accept="image/*" capture="environment" multiple disabled={busy} onChange={(e) => void add(e.target.files)} className="text-caption" aria-label={label} />}
      {busy && <span className="text-caption text-muted">Uploading…</span>}
    </div>
  );
}
