"use client";
// A row of toggle chips where several can be on at once, such as the weekdays
// the hotel takes bookings. Each chip is a real button with aria-pressed, so a
// screen reader says which ones are on, and each is at least 44 pixels tall.

/** Chips for [options]: each one toggles in or out of [picked], and [onChange] gets the new list (in option order). */
export function ToggleChips({
  options,
  picked,
  label,
  onChange,
}: {
  /** Every chip's text, in the order they show. */
  options: string[];
  /** The chips that are on. */
  picked: string[];
  /** The group's name for screen readers. */
  label: string;
  /** Called with the new list of chips that are on. */
  onChange: (picked: string[]) => void;
}) {
  // Step 1: a tap adds the chip if it is off, or removes it if it is on; the list keeps the option order.
  const toggle = (option: string) => {
    const next = picked.includes(option) ? picked.filter((p) => p !== option) : [...picked, option];
    onChange(options.filter((o) => next.includes(o)));
  };
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = picked.includes(o);
        return (
          <button
            key={o}
            type="button"
            aria-pressed={on}
            onClick={() => toggle(o)}
            className={`min-h-11 min-w-11 rounded-full border px-3 text-label ${on ? "border-primary bg-primary-container font-bold text-on-primary-container" : "border-outline hover:bg-surface-alt"}`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}
