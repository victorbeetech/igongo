// S00-26 Search results: the full answer to one global search, grouped as
// dishes then outlets. It opens from the search box on S00-25, with the text
// in the address (`?q=...`), and reuses the same results view.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/screen_context.dart';
import '../../../../shared/live/live_view.dart';
import '../../../../shared/screens/screen_layout.dart';
import '../../../../shared/ui/message/state_message.dart';
import '../../../../shared/theme/theme.dart';
import '../../application/global_search_providers.dart';
import '../../domain/menu_search_results.dart';
import '../../domain/search_limits.dart';
import '../global_search/search_results_view.dart';

/// The search results screen for [screen].
class SearchResultsScreen extends ConsumerWidget {
  /// Creates the screen.
  const SearchResultsScreen(this.screen, {super.key});

  /// The screen's context: its name, its design and its links.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Step 1: read the search text from the address. Too short, or missing, means there is nothing to search.
    final query = GoRouterState.of(context).uri.queryParameters['q']?.trim() ?? '';
    if (query.length < minSearchLength) {
      return const StateMessage(
        icon: Icons.search,
        title: 'Nothing to search',
        message: 'Go back and type at least two letters of a dish, a drink or an outlet.',
      );
    }
    // Step 2: the live results for that text, with the designed loading and error states.
    return LiveView<MenuSearchResults>(
      screenName: screen.spec.name,
      value: ref.watch(globalSearchProvider(query)),
      sample: (_) => screenLayout(screen),
      onRetry: () => ref.invalidate(globalSearchProvider(query)),
      builder: (context, results, _) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Step 3: say what was searched for, then the results.
          Padding(
            padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.lg, IgongoSpace.lg, IgongoSpace.sm),
            child: Text('Results for "$query"', style: context.text.titleSmall),
          ),
          Expanded(child: SearchResultsView(results: results, query: query)),
        ],
      ),
    );
  }
}
