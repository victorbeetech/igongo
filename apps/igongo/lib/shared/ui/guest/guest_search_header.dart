// The red band at the top of a guest browsing screen: a rounded search box
// on Igongo red (the same in light and dark mode). Used by the food shop and
// any other guest screen that lists things to search.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';

/// A red band holding one search box.
class GuestSearchHeader extends StatelessWidget {
  /// Creates the band; [onChanged] gets the text as it is typed, and [onSubmitted] the text when the search key is pressed.
  const GuestSearchHeader({super.key, required this.hint, required this.onChanged, this.onSubmitted});

  /// The box's hint, such as "Search the menu".
  final String hint;

  /// Called with the text on every change.
  final ValueChanged<String> onChanged;

  /// Called with the text when the guest presses the search key, or null to do nothing then.
  final ValueChanged<String>? onSubmitted;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Container(
      padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.sm, IgongoSpace.lg, IgongoSpace.lg),
      decoration: BoxDecoration(
        color: p.primary,
        borderRadius: const BorderRadius.vertical(bottom: Radius.circular(IgongoSpace.xl)),
      ),
      child: TextField(
        onChanged: onChanged,
        onSubmitted: onSubmitted,
        textInputAction: TextInputAction.search,
        decoration: InputDecoration(
          hintText: hint,
          prefixIcon: const Icon(Icons.search),
          filled: true,
          fillColor: p.brandCream,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(IgongoRadius.pill),
            borderSide: BorderSide.none,
          ),
        ),
      ),
    );
  }
}
