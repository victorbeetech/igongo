// A labelled text box whose value the page controls, for real forms.
// Looks exactly like Field (the sample field), from the same tokens.

import { useId } from "react";

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  hint?: string;
  autoComplete?: string;
  required?: boolean;
}

/** A controlled, labelled text box. */
export function TextInput({ label, value, onChange, type = "text", hint, autoComplete, required }: TextInputProps) {
  const id = useId();
  return (
    <label htmlFor={id} className="grid gap-1">
      <span className="text-label font-bold">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        placeholder={hint ?? label}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-11 rounded-md border border-outline bg-surface-alt px-3 text-body outline-none focus:border-primary-text focus:ring-2 focus:ring-primary-text/30"
      />
    </label>
  );
}
