// The search button on the guest home's top row, where the points pill used to be:
// a round surface button with a search icon. Tapping it opens the search page.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';

/// The round search button in the top row.
class GuestSearchButton extends StatelessWidget {
  /// Creates the button; [onPressed] opens the search page.
  const GuestSearchButton({super.key, required this.onPressed});

  /// Called when the search button is tapped.
  final VoidCallback onPressed;

  /// The size of the round button in logical pixels, the same as the bell.
  static const _size = 36.0;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return IconButton(
      tooltip: 'Search',
      onPressed: onPressed,
      // Step 1: a round surface with a soft edge, the search icon in the middle.
      icon: SizedBox(
        width: _size,
        height: _size,
        child: DecoratedBox(
          decoration: BoxDecoration(
            color: p.surface,
            shape: BoxShape.circle,
            border: Border.all(color: p.border),
          ),
          child: Icon(Icons.search, size: IgongoSpace.lg, color: p.text),
        ),
      ),
    );
  }
}
