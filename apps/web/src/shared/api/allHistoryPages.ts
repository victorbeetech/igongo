// Reads a whole guest history (orders, bookings, payments) across the API's pages.
// The API returns the newest page and a `nextBefore` cursor; this asks for
// older pages until the cursor is null, so the existing pages show everything.

import { api } from "./apiClient";

/** A safety cap on the pages read in one go (200 pages of history per list). */
const MAX_PAGES = 200;

/** The shape every history endpoint returns: one page of rows and the cursor for the older page. */
interface HistoryPageBody<T> {
  items: T[];
  nextBefore: string | null;
}

/**
 * Reads every page of the history list at [path], newest first.
 * Each request after the first adds `before=<cursor>` from the page before.
 */
export async function allHistoryPages<T>(path: string): Promise<T[]> {
  // Step 1: start with no rows and no cursor.
  const rows: T[] = [];
  let before: string | null = null;
  // Step 2: read pages one after another until the server has no older page.
  for (let page = 0; page < MAX_PAGES; page++) {
    // Step 2a: add the cursor to the URL after the first page.
    const separator = path.includes("?") ? "&" : "?";
    const url: string = before === null ? path : `${path}${separator}before=${encodeURIComponent(before)}`;
    // Step 2b: keep this page's rows.
    const body: HistoryPageBody<T> = await api<HistoryPageBody<T>>(url);
    rows.push(...body.items);
    // Step 2c: the next cursor; null means this was the last page.
    before = body.nextBefore;
    if (before === null) break;
  }
  return rows;
}
