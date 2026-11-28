/**
 * Global search over the menu (S00-25): finds dishes and outlets the guest
 * may see. An outlet is listed when its name matches or it sells a matched dish. The rule is the client view's: a dish must be switched on, shown to
 * clients and sold at a client outlet; an outlet must be a client outlet.
 * Anyone may search (guests browse before they sign in), so nothing hidden
 * or staff-only is ever returned.
 */

import { matchItems, menuSearchResult, outletsForSearch, searchWords } from "../../domain/menu-search";
import type { MenuSearchResult } from "../../domain/menu-search-result";
import type { MenuDeps } from "../menu-deps";

/** Searches the client-visible menu for [text]; returns dishes and outlets that match every word. */
export async function searchMenu(deps: MenuDeps, text: string): Promise<MenuSearchResult> {
  // Step 1: the words the guest typed, in lower case.
  const words = searchWords(text);
  if (words.length === 0) return { items: [], outlets: [] };
  // Step 2: the menu settings, which say which outlets clients see.
  const settings = await deps.settings.read();
  const clientOutlets = new Set(settings.clientOutlets);
  // Step 3: only the dishes the client view shows (switched on, visible, at a client outlet).
  const visible = (await deps.items.list({})).filter((i) => i.active && i.visibleToClients && clientOutlets.has(i.outlet));
  // Step 4: match the words and rank the dishes.
  const items = matchItems(visible, words, deps.change.now);
  // Step 5: the outlets the client view shows, that match by name or sell a matched dish.
  const outlets = outletsForSearch(
    settings.outlets.filter((o) => clientOutlets.has(o.key)),
    words,
    new Set(items.map((i) => i.outlet)),
  );
  // Step 6: cut each list to its limit.
  return menuSearchResult(items, outlets);
}
