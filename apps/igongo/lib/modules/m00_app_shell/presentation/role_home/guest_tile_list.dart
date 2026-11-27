// The guest home's tiles: every tile the same size, one line of text, in a
// grid of at least two columns (two on a phone, more as the screen widens).

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

/// Lays [children] out in equal-width columns (about 180 px each, at least two).
class GuestTileList extends StatelessWidget {
  /// Creates the list. Pass [columns] to fix the count; otherwise it follows the width.
  const GuestTileList({super.key, required this.children, this.columns});

  /// The tiles (AreaCard), all of the same height.
  final List<Widget> children;

  /// A fixed number of columns, or null to fit the width.
  final int? columns;

  @override
  Widget build(BuildContext context) => LayoutBuilder(
    builder: (context, box) {
      // Step 1: a fixed count if given, else how many columns fit; then each tile's width.
      final count = columns ?? (box.maxWidth / 180).floor().clamp(2, 4);
      final width = (box.maxWidth - IgongoSpace.sm * (count - 1)) / count;
      // Step 2: a wrap keeps rows tidy at any width.
      return Wrap(
        spacing: IgongoSpace.sm,
        runSpacing: IgongoSpace.sm,
        children: [for (final c in children) SizedBox(width: width, child: c)],
      );
    },
  );
}
