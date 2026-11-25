// The search box at the top of lists and the global search.

import { Search } from "lucide-react";

/** A rounded search box. */
export function SearchField({ hint }: { hint: string }) {
  return (
    <label className="flex min-h-11 items-center gap-2 rounded-full border border-outline bg-surface-alt px-4 focus-within:border-primary-text">
      <Search size={18} className="text-muted" aria-hidden />
      <input type="search" placeholder={hint} aria-label={hint} className="flex-1 bg-transparent text-body outline-none" />
    </label>
  );
}
