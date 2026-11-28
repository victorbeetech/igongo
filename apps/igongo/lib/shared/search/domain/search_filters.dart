// The choices on the Filter & Refine screen that narrow or order the search results:
// which outlets, whether only dishes on sale today, the highest price, and the order.

import 'package:flutter/foundation.dart';

import 'search_sort.dart';

/// The filter choices. The default value narrows nothing and keeps the server's order.
@immutable
class SearchFilters {
  /// Creates the choices.
  const SearchFilters({this.outlets = const {}, this.availableOnly = false, this.maxPrice, this.sort = SearchSort.standard});

  /// The outlet keys chosen; empty means every outlet.
  final Set<String> outlets;

  /// True to show only dishes that are on sale today.
  final bool availableOnly;

  /// The highest price to show in whole shillings, or null for no limit.
  final int? maxPrice;

  /// The order of the results.
  final SearchSort sort;

  /// True when any choice narrows or reorders the results (used to show the filter is on).
  bool get isActive => outlets.isNotEmpty || availableOnly || maxPrice != null || sort != SearchSort.standard;

  /// A copy with some choices changed.
  SearchFilters copyWith({Set<String>? outlets, bool? availableOnly, int? maxPrice, bool clearMaxPrice = false, SearchSort? sort}) =>
      SearchFilters(
        outlets: outlets ?? this.outlets,
        availableOnly: availableOnly ?? this.availableOnly,
        maxPrice: clearMaxPrice ? null : (maxPrice ?? this.maxPrice),
        sort: sort ?? this.sort,
      );
}
