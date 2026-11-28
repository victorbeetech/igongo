// One column of the quick-action grid: up to two cards stacked top to bottom.
// Each card sits in a box of the same token size, so every card in the grid matches.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

/// A column of up to two quick-action cards, each in a fixed-size box.
class GuestQuickActionColumn extends StatelessWidget {
  /// Creates the column from its [children] (one or two cards).
  const GuestQuickActionColumn({super.key, required this.children});

  /// The cards in this column, top to bottom.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) => SizedBox(
    width: IgongoQuickAction.width,
    child: Column(
      spacing: IgongoSpace.xs,
      children: [
        // Step 1: wrap each card in a box of the token width and height.
        for (final child in children) SizedBox(height: IgongoQuickAction.height, child: child),
      ],
    ),
  );
}
