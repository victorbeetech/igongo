// The Food tab's search row: a search field that filters dishes by name as the
// guest types, and a filter button beside it.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// The search field and the filter button.
class FoodSearchBar extends StatelessWidget {
  /// Creates the row. [onChanged] gets the text on every change; [onFilter] is called by the filter button.
  const FoodSearchBar({super.key, required this.onChanged, required this.onFilter});

  /// Called with the text each time it changes.
  final ValueChanged<String> onChanged;

  /// Called when the filter button is tapped.
  final VoidCallback onFilter;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: the search field, a soft pill with no outline (the focus ring comes from the theme).
    return Row(
      children: [
        Expanded(
          child: TextField(
            onChanged: onChanged,
            textInputAction: TextInputAction.search,
            decoration: InputDecoration(
              hintText: 'Search dishes, drinks, local specials...',
              prefixIcon: const Icon(Icons.search),
              filled: true,
              fillColor: p.surfaceAlt,
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(IgongoRadius.pill), borderSide: BorderSide.none),
            ),
          ),
        ),
        const SizedBox(width: IgongoSpace.sm),
        // Step 2: the filter button (filters are not built yet; it shows a notice).
        IconButton(
          tooltip: 'Filter menu',
          onPressed: onFilter,
          style: IconButton.styleFrom(
            backgroundColor: p.surfaceAlt,
            foregroundColor: p.text,
            minimumSize: const Size.square(IgongoTouch.minimum),
          ),
          icon: const Icon(Icons.tune),
        ),
      ],
    );
  }
}
