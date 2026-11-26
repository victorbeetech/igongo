"use client";
// One number rule on the Security settings page (such as "Locked for 15
// minutes"): a small number box saved when the person leaves it.

import { useId, useState } from "react";

interface NumberRuleProps {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  onSave: (value: number) => void;
}

/** A labelled number, saved on blur when it changed and is in range. */
export function NumberRule({ label, unit, value, min, max, onSave }: NumberRuleProps) {
  const id = useId();
  const [text, setText] = useState(String(value));
  const n = Number(text);
  const valid = Number.isInteger(n) && n >= min && n <= max;
  return (
    <label htmlFor={id} className="flex items-center gap-3 border-b border-line p-3 last:border-b-0">
      <span className="flex-1 text-body">{label}</span>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => valid && n !== value && onSave(n)}
        aria-invalid={!valid}
        className={`min-h-11 w-20 rounded-md border bg-surface-alt px-2 text-right text-body ${valid ? "border-outline" : "border-error"}`}
      />
      <span className="w-16 text-caption text-muted">{unit}</span>
    </label>
  );
}
