/**
 * Keeps only the switched-on items of each list, sorted by their sort order.
 * The guest app shows this view; the admin sees the whole document.
 */

import { CONTENT_LISTS, type GuestContent } from "./content";

/** Returns [content] with each list cut to its active items, sorted. */
export function activeContent(content: GuestContent): GuestContent {
  const out = { ...content } as GuestContent;
  for (const key of CONTENT_LISTS) {
    // Filter out switched-off items, then sort the rest by their sort order.
    out[key] = [...content[key]].filter((i) => i.active).sort((a, b) => a.sortOrder - b.sortOrder) as never;
  }
  return out;
}
