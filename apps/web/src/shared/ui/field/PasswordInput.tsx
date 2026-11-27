"use client";
// A labelled password box with a show/hide eye at its end. The owner keeps the
// "shown" flag, so one flag can drive several boxes together (the reset page
// shows both of its boxes with one eye, as the app does).

import { Eye, EyeOff } from "lucide-react";
import { useId } from "react";

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Whether the password text is visible right now. */
  shown: boolean;
  /** Called when the eye is pressed; the owner flips its own flag. */
  onToggle: () => void;
  autoComplete?: string;
  required?: boolean;
}

/** A controlled password box. Changing [shown] never clears the typed text. */
export function PasswordInput({ label, value, onChange, shown, onToggle, autoComplete, required }: PasswordInputProps) {
  const id = useId();
  return (
    <label htmlFor={id} className="grid gap-1">
      <span className="text-label font-bold">{label}</span>
      <span className="flex min-h-11 items-center rounded-md border border-outline bg-surface-alt focus-within:border-primary-text focus-within:ring-2 focus-within:ring-primary-text/30">
        <input
          id={id}
          type={shown ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          required={required}
          placeholder={label}
          className="min-w-0 flex-1 bg-transparent px-3 text-body outline-none"
        />
        {/* The eye: tapping it only flips the shared flag, so the text stays. */}
        <button
          type="button"
          onClick={onToggle}
          aria-label={shown ? `Hide ${label}` : `Show ${label}`}
          className="inline-flex size-11 shrink-0 items-center justify-center text-muted hover:text-ink"
        >
          {shown ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </span>
    </label>
  );
}
