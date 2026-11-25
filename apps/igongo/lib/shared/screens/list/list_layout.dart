// The list layout: search, filter chips, the module's records and links on.
// Used by every screen whose kind is "list".

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../catalog/catalog.dart';
import '../parts/dialog_buttons.dart';
import '../parts/link_rows.dart';
import '../parts/purpose_text.dart';
import '../parts/sample_rows.dart';
import '../parts/screen_list_view.dart';
import '../../ui/search/search_field.dart';

/// A searchable, filterable list of records.
class ListLayout extends StatelessWidget {
  /// Creates the list for [screen].
  const ListLayout(this.screen, {super.key});

  /// The screen being drawn.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context) {
    final mock = screen.module.mock;
    // A record row opens the first record screen this list leads to, if any.
    final first = screen.links.isEmpty ? null : screen.links.first;
    return ScreenListView(
      children: [
        PurposeText(screen.spec.purpose),
        // Step 1: search and the status filters.
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg, vertical: IgongoSpace.sm),
          child: SearchField(hint: 'Search ${screen.spec.name.toLowerCase()}'),
        ),
        SizedBox(
          height: 40,
          child: ListView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
            children: [
              for (final (i, s) in ['All', ...mock.statuses].indexed)
                Padding(
                  padding: const EdgeInsets.only(right: IgongoSpace.sm),
                  child: FilterChip(label: Text(s), selected: i == 0, onSelected: (_) {}),
                ),
            ],
          ),
        ),
        // Step 2: the records, then where else the screen leads, then its dialogs.
        SampleRows(mock: mock, onTap: first == null ? null : () => screen.open(first)),
        LinkRows(screen),
        DialogButtons(screen),
      ],
    );
  }
}
