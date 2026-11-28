// The search filter choices, kept for the whole app (Riverpod). The Filter &
// Refine screen writes them when the guest taps Apply; the search screen reads them.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../domain/search_filters.dart';

/// Holds the current [SearchFilters] and changes them through [apply] and [clear].
class SearchFiltersController extends Notifier<SearchFilters> {
  @override
  SearchFilters build() => const SearchFilters();

  /// Replaces the choices with [filters] (called when the guest taps Apply).
  void apply(SearchFilters filters) => state = filters;

  /// Puts every choice back to the default (no outlet, no price limit, standard order).
  void clear() => state = const SearchFilters();
}

/// The filter choices the search results follow.
final searchFiltersProvider = NotifierProvider<SearchFiltersController, SearchFilters>(SearchFiltersController.new);
