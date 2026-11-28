// S00-25 Global search, drawn to the Igongo discovery design: a top bar, a search
// box with a filter button, recent searches, explore categories, curated findings
// and trending experiences. The findings and trending items come from the super
// admin. Typing two letters or more shows the live menu results instead.

import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../app/catalog/catalog_index.dart';
import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/hotel/application/public_settings_providers.dart';
import '../../../../shared/hotel/domain/hotel_content_item.dart';
import '../../../../shared/live/live_view.dart';
import '../../../../shared/screens/screen_layout.dart';
import '../../../../shared/ui/toast/igongo_toast.dart';
import '../../application/global_search_providers.dart';
import '../../domain/menu_search_results.dart';
import '../../domain/search_limits.dart';
import 'discovery_categories.dart';
import 'search_results_view.dart';
import 'widgets/curated_findings_section.dart';
import 'widgets/discovery_search_row.dart';
import 'widgets/discovery_top_bar.dart';
import 'widgets/explore_categories.dart';
import 'widgets/recent_searches.dart';
import 'widgets/trending_experiences_card.dart';

/// The results screen (S00-26) that the search key opens.
const String _resultsScreenId = 'S00-26';

/// The screen a finding or experience opens when the admin gave it none: the menu.
const String _defaultContentScreen = 'S62-01';

/// How many recent searches are kept on the screen.
const int _maxRecent = 8;

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

  /// The index of the chosen category pill.
  int _category = 0;

  /// The searches made on this screen (newest first), shown as recent searches.
  final List<String> _recent = [];

  @override
  void dispose() {
    // Step 1: stop any pending search when the screen closes.
    _debounce?.cancel();
    super.dispose();
  }

  /// Remembers a search the guest made, newest first, without repeats.
  void _remember(String query) {
    setState(() {
      _recent
        ..remove(query)
        ..insert(0, query);
      if (_recent.length > _maxRecent) _recent.removeRange(_maxRecent, _recent.length);
    });
  }

  /// The search key: opens the full results screen for the text, when it is long enough.
  void _onSubmitted(String text) {
    final query = text.trim();
    if (query.length < minSearchLength) return;
    final results = CatalogIndex.instance.screens[_resultsScreenId];
    if (results == null) return;
    _remember(query);
    // The text travels in the address (`?q=...`), so the results can be shared and reloaded.
    context.push(Uri(path: CatalogIndex.instance.locationOf(results), queryParameters: {'q': query}).toString());
  }

  /// Called on every key press: restarts the pause, then searches the text typed.
  void _onTyped(String text) {
    _debounce?.cancel();
    _debounce = Timer(_typingPause, () {
      if (!mounted) return;
      final query = text.trim();
      setState(() => _query = query);
      if (query.length >= minSearchLength) _remember(query);
    });
  }

  /// Opens a finding or experience's screen, or the menu when the admin gave none.
  void _openContent(HotelContentItem item) {
    final code = item.screen.isEmpty ? _defaultContentScreen : item.screen;
    final target = CatalogIndex.instance.screens[code];
    if (target == null) {
      showIgongoToast(context, 'This item is not linked to a screen yet.');
      return;
    }
    context.push(CatalogIndex.instance.locationOf(target));
  }

  @override
  Widget build(BuildContext context) => Column(
    children: [
      // Step 1: the top bar with the logo, the bell and the profile picture.
      DiscoveryTopBar(onBell: () {}), // The notification inbox is wired later.
      // Step 2: the search box, the filter button and the mic.
      Padding(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
        child: DiscoverySearchRow(
          onFilter: () => showIgongoToast(context, 'Filters are not available yet.'),
          onChanged: _onTyped,
          onSubmitted: _onSubmitted,
          onVoice: () => showIgongoToast(context, 'Voice search is not available yet.'),
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
    return _Discovery(
      recent: _recent,
      category: _category,
      onRemoveRecent: (search) => setState(() => _recent.remove(search)),
      onClearRecent: () => setState(_recent.clear),
      onCategory: (index) => setState(() => _category = index),
      onOpen: _openContent,
    );
  }
}

/// The discovery sections: recent searches, categories, curated findings and trending experiences.
/// The last two come from the super admin's public settings; a loading state keeps the layout steady.
class _Discovery extends ConsumerWidget {
  const _Discovery({
    required this.recent,
    required this.category,
    required this.onRemoveRecent,
    required this.onClearRecent,
    required this.onCategory,
    required this.onOpen,
  });

  /// The searches made on this screen, newest first.
  final List<String> recent;

  /// The chosen category pill.
  final int category;

  /// Called with a recent search to remove it.
  final ValueChanged<String> onRemoveRecent;

  /// Called when "Clear All" is tapped.
  final VoidCallback onClearRecent;

  /// Called with the index of the category tapped.
  final ValueChanged<int> onCategory;

  /// Called with the finding or experience tapped.
  final ValueChanged<HotelContentItem> onOpen;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Step 1: the admin's findings and trending experiences. An unreadable reply shows as empty.
    final settings = ref.watch(publicSettingsProvider);
    final findings = settings.valueOrNull?.findings ?? const <HotelContentItem>[];
    final trending = settings.valueOrNull?.trending ?? const <HotelContentItem>[];
    return ListView(
      padding: const EdgeInsets.only(top: 8, bottom: 24),
      children: [
        RecentSearches(searches: recent, onRemove: onRemoveRecent, onClear: onClearRecent),
        const SizedBox(height: 16),
        ExploreCategories(categories: discoveryCategories, selected: category, onSelected: onCategory),
        const SizedBox(height: 24),
        if (settings.isLoading)
          const Center(child: Padding(padding: EdgeInsets.all(24), child: CircularProgressIndicator()))
        else ...[
          CuratedFindingsSection(findings: findings, onOpen: onOpen),
          const SizedBox(height: 8),
          TrendingExperiencesCard(experiences: trending, onOpen: onOpen),
        ],
      ],
    );
  }
}
