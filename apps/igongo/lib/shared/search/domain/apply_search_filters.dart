// Applies the Filter & Refine choices to the search results: keeps the dishes
// that match the outlets, availability and highest price, then sorts them.
// Outlets are kept as they are, so the screen can still list them.

import '../../../modules/m00_app_shell/domain/menu_search_results.dart';
import '../../../modules/m00_app_shell/domain/search_item_hit.dart';
import 'search_filters.dart';
import 'search_sort.dart';

/// The results after [filters]. Pure: the same input always gives the same output.
MenuSearchResults applySearchFilters(MenuSearchResults results, SearchFilters filters) {
  // Step 1: keep only the dishes that pass every choice that is set.
  final kept = [
    for (final item in results.items)
      if (_passes(item, filters)) item,
  ];
  // Step 2: order them as the guest chose; the standard order keeps the server's list.
  // The standard order is not re-sorted, so the server's order is kept exactly.
  if (filters.sort != SearchSort.standard) kept.sort(_comparatorFor(filters.sort));
  return MenuSearchResults(items: kept, outlets: results.outlets);
}

/// True when [item] matches the outlet, availability and price choices.
bool _passes(SearchItemHit item, SearchFilters filters) {
  if (filters.outlets.isNotEmpty && !filters.outlets.contains(item.outlet)) return false;
  if (filters.availableOnly && !item.available) return false;
  final cap = filters.maxPrice;
  if (cap != null && item.price > cap) return false;
  return true;
}

/// The comparison for [sort] (the standard order has none).
int Function(SearchItemHit, SearchItemHit) _comparatorFor(SearchSort sort) => switch (sort) {
  SearchSort.standard => (a, b) => 0,
  SearchSort.priceLowToHigh => (a, b) => a.price.compareTo(b.price),
  SearchSort.priceHighToLow => (a, b) => b.price.compareTo(a.price),
  SearchSort.nameAtoZ => (a, b) => a.name.toLowerCase().compareTo(b.name.toLowerCase()),
};
