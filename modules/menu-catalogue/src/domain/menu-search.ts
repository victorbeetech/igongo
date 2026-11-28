/**
 * Menu search rules (S00-25): how a guest's words are split, which dishes and
 * outlets match them, and in what order. Pure functions with no database,
 * so the rules are tested on their own.
 */

import type { MenuItem } from "./menu-item";
import type { MenuSearchItem, MenuSearchOutlet, MenuSearchResult } from "./menu-search-result";
import { isAvailable } from "./menu-item";

/** The most results returned for each kind, so one search stays small. */
export const SEARCH_LIMITS = { items: 20, outlets: 10 } as const;

/** Splits the guest's text into lower-case words: "  Fried   BEEF " gives ["fried", "beef"]. */
export function searchWords(text: string): string[] {
  return text.toLowerCase().trim().split(/\s+/).filter(Boolean);
}

/** The text of a dish that a search looks through: name, section, description and tags. */
function itemText(item: MenuItem): string {
  return [item.name, item.section, item.description ?? "", ...item.tags].join(" ").toLowerCase();
}

/**
 * How well a dish matches the words: 0 when its name starts with the first
 * word, 1 when its name has the whole phrase, 2 when only other text matches,
 * and -1 when not every word appears anywhere (no match).
 */
function rank(item: MenuItem, words: string[]): number {
  if (!words.every((w) => itemText(item).includes(w))) return -1;
  const name = item.name.toLowerCase();
  if (name.startsWith(words[0] ?? "")) return 0;
  if (name.includes(words.join(" "))) return 1;
  return 2;
}

/**
 * The dishes that match [words], best match first, then by name. Only the
 * dishes passed in are looked at, so callers filter to the client view first.
 */
export function matchItems(items: MenuItem[], words: string[], now: Date): MenuSearchItem[] {
  return items
    .map((item) => ({ item, score: rank(item, words) }))
    .filter((m) => m.score >= 0)
    .sort((a, b) => a.score - b.score || a.item.name.localeCompare(b.item.name))
    .map(({ item }) => ({
      id: item.id,
      outlet: item.outlet,
      section: item.section,
      name: item.name,
      price: item.price,
      available: isAvailable(item, now),
      photoUrl: item.photoUrl,
    }));
}

/** The outlets whose name or key contains every word, in the order given. */
export function matchOutlets(outlets: MenuSearchOutlet[], words: string[]): MenuSearchOutlet[] {
  return outlets.filter((o) => {
    const text = `${o.name} ${o.key}`.toLowerCase();
    return words.every((w) => text.includes(w));
  });
}

/**
 * The outlets to list for a search: those whose name matches the words, plus
 * every outlet that sells one of the matched dishes, so a guest can filter a
 * dish search by outlet. Kept in the order the outlets were given.
 */
export function outletsForSearch(outlets: MenuSearchOutlet[], words: string[], sellingKeys: Set<string>): MenuSearchOutlet[] {
  // Step 1: the outlets whose own name matches the words.
  const byName = new Set(matchOutlets(outlets, words).map((o) => o.key));
  // Step 2: keep an outlet when its name matches or it sells a matched dish.
  return outlets.filter((o) => byName.has(o.key) || sellingKeys.has(o.key));
}

/** The whole answer: the matched dishes and outlets, each cut to its limit. */
export function menuSearchResult(items: MenuSearchItem[], outlets: MenuSearchOutlet[]): MenuSearchResult {
  return {
    items: items.slice(0, SEARCH_LIMITS.items),
    outlets: outlets.slice(0, SEARCH_LIMITS.outlets),
  };
}
