// The guest home's tiles: every tile the same size, one line of text, in as
// many columns as the screen width allows (one on a phone, more on a tablet).

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

/// Lays [children] out in equal-width columns (about 320 px each, at least one).
class GuestTileList extends StatelessWidget {
  /// Creates the list.
  const GuestTileList({super.key, required this.children});

  /// The tiles (AreaCard), all of the same height.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) => LayoutBuilder(
    builder: (context, box) {
      // Step 1: how many columns fit, then each tile's width.
      final columns = (box.maxWidth / 320).floor().clamp(1, 4);
      final width = (box.maxWidth - IgongoSpace.sm * (columns - 1)) / columns;
      // Step 2: a wrap keeps rows tidy at any width.
      return Wrap(
        spacing: IgongoSpace.sm,
        runSpacing: IgongoSpace.sm,
        children: [for (final c in children) SizedBox(width: width, child: c)],
      );
    },
  );
}
