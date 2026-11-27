// The results of one global search: the matching dishes, then the outlets.
// Tapping either one opens the food ordering screen (S62-01), where the menu is.

import 'package:material_ui/material_ui.dart';

import '../../../../app/navigation/open_target.dart';
import '../../../../shared/format/ugx.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/list_row/igongo_list_row.dart';
import '../../../../shared/ui/message/state_message.dart';
import '../../domain/menu_search_results.dart';

/// The food ordering screen, where a dish or an outlet is ordered from.
const String _foodScreenId = 'S62-01';

/// Draws the results of one search, or a message when nothing matches.
class SearchResultsView extends StatelessWidget {
  /// Creates the view for [results] of the search text [query].
  const SearchResultsView({super.key, required this.results, required this.query});

  /// What the server found.
  final MenuSearchResults results;

  /// The text searched for, shown in the empty message.
  final String query;

  @override
  Widget build(BuildContext context) {
    // Step 1: nothing matched, so say so and suggest another word.
    if (results.isEmpty) {
      return StateMessage(
        icon: Icons.search_off,
        title: 'Nothing matches "$query"',
        message: 'Try another word, such as a dish, a drink or an outlet name.',
      );
    }
    // Step 2: dishes first, each showing its price and whether it is off today.
    return ScreenListView(
      children: [
        if (results.items.isNotEmpty) ...[
          Text('Dishes', style: context.text.titleMedium),
          for (final item in results.items)
            IgongoListRow(
              title: item.name,
              subtitle: '${ugx(item.price)} · ${item.section}',
              status: item.available ? null : 'Out today',
              onTap: () => openTarget(context, _foodScreenId),
            ),
        ],
        // Step 3: then the outlets that match.
        if (results.outlets.isNotEmpty) ...[
          Text('Outlets', style: context.text.titleMedium),
          for (final outlet in results.outlets)
            IgongoListRow(title: outlet.name, subtitle: 'Outlet', onTap: () => openTarget(context, _foodScreenId)),
        ],
      ],
    );
  }
}
