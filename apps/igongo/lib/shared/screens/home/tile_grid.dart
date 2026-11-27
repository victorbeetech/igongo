// A responsive grid for home tiles: two across on phones, more on tablets
// and the web. Shared by the hub layout, every role home and the guest home.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

/// Lays [children] out in equal columns that fit the width.
class TileGrid extends StatelessWidget {
  /// Creates the grid. Pass [columns] to fix the count (the guest home uses four);
  /// otherwise the count follows the width.
  const TileGrid({super.key, required this.children, this.columns});

  /// The tiles.
  final List<Widget> children;

  /// A fixed number of columns, or null to fit the width.
  final int? columns;

  @override
  Widget build(BuildContext context) => LayoutBuilder(
    builder: (context, box) {
      // Step 1: a fixed count if given; otherwise about 170 pixels per column, at least two.
      final count = columns ?? (box.maxWidth / 170).floor().clamp(2, 6);
      // Step 2: each column's width, leaving the gap between columns.
      final width = (box.maxWidth - IgongoSpace.sm * (count - 1)) / count;
      // Step 3: a wrap keeps each tile's natural height, so long labels never clip.
      return Wrap(
        spacing: IgongoSpace.sm,
        runSpacing: IgongoSpace.sm,
        children: [for (final c in children) SizedBox(width: width, child: c)],
      );
    },
  );
}
