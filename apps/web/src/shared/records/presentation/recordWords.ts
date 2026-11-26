// Small helpers the record pages share: a status's words, and the type a page should use.

import type { RecordConfig, RecordType } from "../types/recordConfig";

/** The label of status [key] of [type], or the key in words when it was removed. */
export function statusLabel(type: RecordType | undefined, key: string): string {
  return type?.statuses.find((s) => s.key === key)?.label ?? key.replace(/_/g, " ");
}

/** The types a page shows: [keys] when given (and still there), else every active one. */
export function typesFor(config: RecordConfig, keys?: string[]): RecordType[] {
  const active = config.types.filter((t) => t.active);
  const picked = keys?.length ? active.filter((t) => keys.includes(t.key)) : active;
  return picked.length ? picked : active;
}
