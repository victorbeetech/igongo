/**
 * One page of a guest's history (orders, bookings, payments), newest first.
 *
 * `nextBefore` is the time to send back as `before` to get the next, older
 * page. It is null on the last page, so the app stops asking.
 */
export interface HistoryPage<T> {
  /** The rows of this page, newest first. */
  items: T[];
  /** ISO time of the oldest row shown, when an older page exists; otherwise null. */
  nextBefore: string | null;
}

/**
 * Turns a repository read of `limit + 1` rows into one page.
 *
 * The extra row is only there to prove an older page exists. It is dropped
 * from the page, and the cursor is the time of the last row that is kept.
 *
 * @param rows  up to `limit + 1` rows, newest first
 * @param limit the page size asked for
 */
export function historyPage<T extends { createdAt: Date }>(rows: T[], limit: number): HistoryPage<T> {
  // Step 1: no extra row means nothing older is left, so this is the last page.
  if (rows.length <= limit) return { items: rows, nextBefore: null };
  // Step 2: keep the first `limit` rows and point the cursor at the last one kept.
  const items = rows.slice(0, limit);
  const last = items[items.length - 1];
  return { items, nextBefore: last ? last.createdAt.toISOString() : null };
}
