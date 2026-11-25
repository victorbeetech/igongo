// A responsive grid for home tiles: two across on phones, more on tablets
// and the web. Shared by the hub layout and every role home.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

/// Lays [children] out in equal columns that fit the width.
class TileGrid extends StatelessWidget {
  /// Creates the grid.
  const TileGrid({super.key, required this.children});

  /// The tiles.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) => LayoutBuilder(
    builder: (context, box) {
      // Step 1: about 170 pixels per column, at least two.
      final columns = (box.maxWidth / 170).floor().clamp(2, 6);
      final width = (box.maxWidth - IgongoSpace.sm * (columns - 1)) / columns;
      // Step 2: a wrap keeps each tile's natural height, so long labels never clip.
      return Wrap(
        spacing: IgongoSpace.sm,
        runSpacing: IgongoSpace.sm,
        children: [for (final c in children) SizedBox(width: width, child: c)],
      );
    },
  );
}
