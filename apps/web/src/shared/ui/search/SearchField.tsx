// The search box at the top of lists and the global search. Pass `value`
// and `onChange` to use it for a live search; without them it is a sample.

import { Search } from "lucide-react";

/** A rounded search box. */
export function SearchField({ hint, value, onChange }: { hint: string; value?: string; onChange?: (value: string) => void }) {
  return (
    <label className="flex min-h-11 items-center gap-2 rounded-full border border-outline bg-surface-alt px-4 focus-within:border-primary-text">
      <Search size={18} className="text-muted" aria-hidden />
      <input
        type="search"
        placeholder={hint}
        aria-label={hint}
        {...(onChange ? { value: value ?? "", onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value) } : {})}
        className="flex-1 bg-transparent text-body outline-none"
      />
    </label>
  );
}
