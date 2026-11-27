// S00-25 Global search: one red search box over the menu. A guest types at
// least two letters, and the dishes and outlets they can see come back. Signed
// out, guests can search too, because the menu is public.

import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/live/live_view.dart';
import '../../../../shared/screens/screen_layout.dart';
import '../../../../shared/ui/guest/guest_search_header.dart';
import '../../../../shared/ui/message/state_message.dart';
import '../../application/global_search_providers.dart';
import '../../domain/menu_search_results.dart';
import 'search_results_view.dart';

/// Shortest search text that is sent to the server.
const int _minQueryLength = 2;

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

  @override
  void dispose() {
    // Step 1: stop any pending search when the screen closes.
    _debounce?.cancel();
    super.dispose();
  }

  /// Called on every key press: restarts the pause, then searches the text typed.
  void _onTyped(String text) {
    _debounce?.cancel();
    _debounce = Timer(_typingPause, () {
      if (mounted) setState(() => _query = text.trim());
    });
  }

  @override
  Widget build(BuildContext context) => Column(
    children: [
      // Step 2: the red band with the search box, the same as the food shop's.
      GuestSearchHeader(hint: 'Search dishes and outlets', onChanged: _onTyped),
      Expanded(child: _body()),
    ],
  );

  /// The body under the search box: a prompt, or the live results for the search text.
  Widget _body() {
    // Step 3: too short to search yet, so show a prompt.
    if (_query.length < _minQueryLength) {
      return const StateMessage(
        icon: Icons.search,
        title: 'Search the menu',
        message: 'Type at least two letters of a dish, a drink or an outlet.',
      );
    }
    // Step 4: the live results, with the designed loading and error states.
    return LiveView<MenuSearchResults>(
      screenName: widget.screen.spec.name,
      value: ref.watch(globalSearchProvider(_query)),
      sample: (_) => screenLayout(widget.screen),
      onRetry: () => ref.invalidate(globalSearchProvider(_query)),
      builder: (context, results, _) => SearchResultsView(results: results, query: _query),
    );
  }
}
