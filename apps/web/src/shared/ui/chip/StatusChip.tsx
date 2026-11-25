// A small pill with a status word and a dot, coloured by its tone.

import { toneOf, type StatusTone } from "./statusTone";

// Text and tint for each tone, from the token colours.
const TONES: Record<StatusTone, string> = {
  success: "text-success bg-success/12",
  warning: "text-warning bg-warning/12",
  error: "text-error bg-error/12",
  info: "text-info bg-info/12",
  neutral: "text-muted bg-muted/12",
};

/** A status pill such as "Paid" or "Blocked". */
export function StatusChip({ status }: { status: string }) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-caption font-bold ${TONES[toneOf(status)]}`}>
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
