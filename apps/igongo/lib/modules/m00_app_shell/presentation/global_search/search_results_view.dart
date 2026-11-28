// The results of one global search: the matching dishes and outlets (filtered by
// the Filter & Refine choices), then the curated findings and experiences that
// match the words. Tapping a dish or outlet opens the food ordering screen (S62-01).

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../app/navigation/open_target.dart';
import '../../../../shared/format/ugx.dart';
import '../../../../shared/hotel/application/public_settings_providers.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/search/application/search_filters_provider.dart';
import '../../../../shared/search/domain/apply_search_filters.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/list_row/igongo_list_row.dart';
import '../../../../shared/ui/message/state_message.dart';
import '../../domain/menu_search_results.dart';
import '../../domain/search_content_match.dart';
import 'open_hotel_content.dart';

/// The food ordering screen, where a dish or an outlet is ordered from.
const String _foodScreenId = 'S62-01';

/// Draws the results of one search, after the Filter & Refine choices, or a message when nothing is left to show.
/// Reads the filter choices and the admin's content itself, so every screen that shows results agrees.
class SearchResultsView extends ConsumerWidget {
  /// Creates the view for [results] (as the server sent them) of the search text [query].
  const SearchResultsView({super.key, required this.results, required this.query});

  /// What the server found, before the filters are applied.
  final MenuSearchResults results;

  /// The text searched for, shown in the empty message.
  final String query;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Step 1: apply the guest's filter choices to the dishes (outlets are kept as they are).
    final filtered = applySearchFilters(results, ref.watch(searchFiltersProvider));
    // Step 2: the admin's findings and experiences that match the words; none while they load.
    final settings = ref.watch(publicSettingsProvider).valueOrNull;
    final content = settings == null
        ? const <HotelContentItem>[]
        : matchHotelContent([...settings.findings, ...settings.trending], query);
    // Step 3: nothing left at all. Say whether the filters hid the dishes, or nothing matched.
    if (filtered.isEmpty && content.isEmpty) return _nothingToShow(context, ref, hiddenByFilters: results.items.isNotEmpty);
    // Step 4: dishes first, each showing its price and whether it is off today.
    return ScreenListView(
      children: [
        if (filtered.items.isNotEmpty) ...[
          Text('Dishes', style: context.text.titleMedium),
          for (final item in filtered.items)
            IgongoListRow(
              title: item.name,
              subtitle: '${ugx(item.price)} · ${item.section}',
              status: item.available ? null : 'Out today',
              onTap: () => openTarget(context, _foodScreenId),
            ),
        ],
        // Step 5: then the outlets that match or sell a matched dish.
        if (filtered.outlets.isNotEmpty) ...[
          Text('Outlets', style: context.text.titleMedium),
          for (final outlet in filtered.outlets)
            IgongoListRow(title: outlet.name, subtitle: 'Outlet', onTap: () => openTarget(context, _foodScreenId)),
        ],
        // Step 6: last, the findings and experiences the admin featured that match the words.
        if (content.isNotEmpty) ...[
          Text('Findings and experiences', style: context.text.titleMedium),
          for (final item in content)
            IgongoListRow(
              title: item.title,
              subtitle: item.subtitle.isEmpty ? null : item.subtitle,
              onTap: () => openHotelContent(context, item),
            ),
        ],
      ],
    );
  }

  /// The message for a search with nothing to list. When the filters hid every dish, it offers to clear them.
  Widget _nothingToShow(BuildContext context, WidgetRef ref, {required bool hiddenByFilters}) {
    // Step 1: filters hid the dishes, so say that and offer to clear them.
    if (hiddenByFilters) {
      return StateMessage(
        icon: Icons.filter_alt_off,
        title: 'No dishes match your filters',
        message: 'Change or clear the filters to see more.',
        actions: [
          TextButton(
            onPressed: () => ref.read(searchFiltersProvider.notifier).clear(),
            child: const Text('Clear filters'),
          ),
        ],
      );
    }
    // Step 2: nothing matched the words at all.
    return StateMessage(
      icon: Icons.search_off,
      title: 'Nothing matches "$query"',
      message: 'Try another word, such as a dish, a drink or an outlet name.',
    );
  }
}
