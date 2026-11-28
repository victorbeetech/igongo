/**
 * Makes the short key a new venue (outlet) gets from its name, such as
 * "Pool bar" becomes "pool-bar". The key never changes after that, so dishes
 * and guest lists keep pointing at the right venue even if it is renamed.
 */

/** The most letters a key may have (the API accepts 2 to 40 characters). */
const MAX_KEY_LENGTH = 40;

/**
 * A key for [name] that no venue already uses. Taken keys get a number on the
 * end ("pool-bar-2"), so two venues with the same name never clash.
 */
export function outletKeyFor(name: string, taken: ReadonlySet<string>): string {
  // Step 1: lower-case the name and turn every run of other characters into one dash.
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    // Step 2: drop dashes at either end, then cut the key to the longest length allowed.
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_KEY_LENGTH)
    .replace(/-+$/, "");
  // Step 3: a name with no letters or digits (such as "!!") still gets a usable key.
  const stem = base.length >= 2 ? base : "venue";
  // Step 4: use the stem if it is free, otherwise the first free number after it.
  if (!taken.has(stem)) return stem;
  for (let n = 2; ; n += 1) {
    const candidate = `${stem.slice(0, MAX_KEY_LENGTH - String(n).length - 1)}-${n}`;
    if (!taken.has(candidate)) return candidate;
  }
}
