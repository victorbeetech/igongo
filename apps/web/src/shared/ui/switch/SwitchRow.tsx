// A labelled on/off switch whose position the page controls (saved to the
// API). Looks like OptionSwitch, the sample switch, from the same tokens.

/** A setting row with a switch. */
export function SwitchRow({ label, hint, on, onChange, disabled }: { label: string; hint?: string; on: boolean; onChange: (on: boolean) => void; disabled?: boolean }) {
  return (
    <div className="flex min-h-14 items-center gap-3 border-b border-line px-4 py-2 last:border-b-0">
      <span className="flex-1">
        <span className="block text-subtitle font-bold">{label}</span>
        {hint && <span className="block text-caption text-muted">{hint}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!on)}
        className={`relative h-7 w-12 rounded-full transition-colors disabled:opacity-50 ${on ? "bg-primary" : "bg-outline"}`}
      >
        <span className={`absolute top-1 size-5 rounded-full bg-surface shadow transition-all ${on ? "left-6" : "left-1"}`} />
      </button>
    </div>
  );
}
