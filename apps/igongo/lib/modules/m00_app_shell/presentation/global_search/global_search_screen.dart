// S00-25 Global search, drawn to the Igongo Cultural Centre discovery design: a
// top bar, a search box with a filter button, recent searches, explore
// categories, curated findings and trending experiences. Typing two letters or
// more shows the live menu results instead. Words, pictures and prices are
// placeholders until the search is wired to the API.

import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../app/catalog/catalog_index.dart';
import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/live/live_view.dart';
import '../../../../shared/screens/screen_layout.dart';
import '../../application/global_search_providers.dart';
import '../../domain/menu_search_results.dart';
import '../../domain/search_limits.dart';
import 'discovery_placeholders.dart';
import 'search_results_view.dart';
import 'widgets/curated_findings_section.dart';
import 'widgets/discovery_filter_summary.dart';
import 'widgets/discovery_search_row.dart';
import 'widgets/discovery_top_bar.dart';
import 'widgets/explore_categories.dart';
import 'widgets/recent_searches.dart';
import 'widgets/trending_experiences_card.dart';

/// The results screen (S00-26) that the search key opens.
const String _resultsScreenId = 'S00-26';

/// Pause after the last key press before the search is sent, so typing does not send a request per letter.
const Duration _typingPause = Duration(milliseconds: 350);

/// The global search screen for [screen].
class GlobalSearchScreen extends ConsumerStatefulWidget {
  /// Creates the screen.
  const GlobalSearchScreen(this.screen, {super.key});

  /// The screen's context: its name, its design and its links.
  final ScreenContext screen;

  @override
  ConsumerState<GlobalSearchScreen> createState() => _GlobalSearchScreenState();
}

class _GlobalSearchScreenState extends ConsumerState<GlobalSearchScreen> {
  /// The timer that waits for the guest to stop typing.
  Timer? _debounce;

  /// The search text sent to the server (trimmed), or empty before a search.
  String _query = '';

  /// Whether the active-filter line under the search box is showing.
  bool _filtersShown = false;

  /// The index of the chosen category pill.
  int _category = 0;

  /// The recent searches still shown (a chip removed here is gone from the list).
  final List<String> _recent = List.of(DiscoveryPlaceholders.recentSearches);

  /// The indexes of the findings the guest marked as favourite.
  final Set<int> _favourites = {0};

  @override
  void dispose() {
    // Step 1: stop any pending search when the screen closes.
    _debounce?.cancel();
    super.dispose();
  }

  /// The search key: opens the full results screen for the text, when it is long enough.
  void _onSubmitted(String text) {
    final query = text.trim();
    if (query.length < minSearchLength) return;
    final results = CatalogIndex.instance.screens[_resultsScreenId];
    if (results == null) return;
    // The text travels in the address (`?q=...`), so the results can be shared and reloaded.
    context.push(Uri(path: CatalogIndex.instance.locationOf(results), queryParameters: {'q': query}).toString());
  }

  /// Called on every key press: restarts the pause, then searches the text typed.
  void _onTyped(String text) {
    _debounce?.cancel();
    _debounce = Timer(_typingPause, () {
      if (mounted) setState(() => _query = text.trim());
    });
  }

  /// Shows or hides the active-filter line.
  void _toggleFilters() => setState(() => _filtersShown = !_filtersShown);

  /// Marks a finding as favourite, or takes the mark off.
  void _toggleFavourite(int index) => setState(() {
    if (!_favourites.remove(index)) _favourites.add(index);
  });

  @override
  Widget build(BuildContext context) => Column(
    children: [
      // Step 1: the top bar with the logo, the bell and the profile picture.
      DiscoveryTopBar(onBell: () {}), // The notification inbox is wired later.
      // Step 2: the search box and filter button, then the filter line when it is open.
      Padding(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            DiscoverySearchRow(
              onFilter: _toggleFilters,
              onChanged: _onTyped,
              onSubmitted: _onSubmitted,
              onVoice: () {}, // Voice search is wired later.
            ),
            if (_filtersShown) ...[
              const SizedBox(height: 8),
              const DiscoveryFilterSummary(filters: DiscoveryPlaceholders.activeFilters),
            ],
          ],
        ),
      ),
      Expanded(child: _body()),
    ],
  );

  /// The body under the search box: the discovery sections, or the live results for the search text.
  Widget _body() {
    // Step 3: two letters or more typed, so show the live menu results.
    if (_query.length >= minSearchLength) {
      return LiveView<MenuSearchResults>(
        screenName: widget.screen.spec.name,
        value: ref.watch(globalSearchProvider(_query)),
        sample: (_) => screenLayout(widget.screen),
        onRetry: () => ref.invalidate(globalSearchProvider(_query)),
        builder: (context, results, _) => SearchResultsView(results: results, query: _query),
      );
    }
    // Step 4: otherwise the discovery design, one scrolling column of sections.
    return ListView(
      padding: const EdgeInsets.only(top: 8, bottom: 24),
      children: [
        RecentSearches(
          searches: _recent,
          onRemove: (search) => setState(() => _recent.remove(search)),
          onClear: () => setState(_recent.clear),
        ),
        const SizedBox(height: 16),
        ExploreCategories(
          categories: DiscoveryPlaceholders.categories,
          selected: _category,
          onSelected: (index) => setState(() => _category = index),
        ),
        const SizedBox(height: 24),
        CuratedFindingsSection(
          findings: DiscoveryPlaceholders.findings,
          favourites: _favourites,
          onFavourite: _toggleFavourite,
        ),
        const SizedBox(height: 8),
        const TrendingExperiencesCard(experiences: DiscoveryPlaceholders.trending),
      ],
    );
  }
}
