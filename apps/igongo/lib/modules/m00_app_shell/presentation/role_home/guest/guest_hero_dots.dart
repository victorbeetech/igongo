// The carousel dots under the hero card: one dot per slide, the current one wide.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';

/// The row of dots that shows which slide is on screen.
class GuestHeroDots extends StatelessWidget {
  /// Creates the dots for [count] slides with [current] active.
  const GuestHeroDots({super.key, required this.count, required this.current});

  /// How many slides there are, one dot each.
  final int count;

  /// The index of the slide on screen.
  final int current;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        // Step 1: one dot per slide; the active one is wide and fully solid.
        for (var i = 0; i < count; i++)
          AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            margin: const EdgeInsets.symmetric(horizontal: IgongoSpace.xxs),
            width: i == current ? IgongoSpace.lg : IgongoSpace.sm,
            height: IgongoSpace.xxs,
            decoration: BoxDecoration(
              color: p.onPrimary.withValues(alpha: i == current ? 1 : 0.4),
              borderRadius: BorderRadius.circular(IgongoRadius.pill),
            ),
          ),
      ],
    );
  }
}
