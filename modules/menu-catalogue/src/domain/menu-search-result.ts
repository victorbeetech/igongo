/**
 * What global search returns for the menu (S00-25): the dishes and the
 * outlets that match what the guest typed. Only what the client view shows.
 */

/** One dish in the search results, with today's availability. */
export interface MenuSearchItem {
  id: string;
  outlet: string;
  section: string;
  name: string;
  /** Base price, whole shillings. */
  price: number;
  /** Off for today (switched off or out of stock), so it cannot be ordered. */
  available: boolean;
  photoUrl: string | null;
}

/** One outlet in the search results. */
export interface MenuSearchOutlet {
  key: string;
  name: string;
}

/** The full answer to one search: dishes first, then outlets. */
export interface MenuSearchResult {
  items: MenuSearchItem[];
  outlets: MenuSearchOutlet[];
}
