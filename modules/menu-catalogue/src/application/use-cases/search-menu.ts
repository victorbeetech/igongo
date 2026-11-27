/**
 * Global search over the menu (S00-25): finds dishes and outlets the guest
 * may see. The rule is the client view's: a dish must be switched on, shown to
 * clients and sold at a client outlet; an outlet must be a client outlet.
 * Anyone may search (guests browse before they sign in), so nothing hidden
 * or staff-only is ever returned.
 */

import { matchItems, matchOutlets, menuSearchResult, searchWords } from "../../domain/menu-search";
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
  // Step 4: the outlets the client view shows.
  const outlets = settings.outlets.filter((o) => clientOutlets.has(o.key));
  // Step 5: match the words, rank, and cut each list to its limit.
  return menuSearchResult(matchItems(visible, words, deps.change.now), matchOutlets(outlets, words));
}
