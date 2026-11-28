// The price histogram: a row of bars standing on a common line, showing how many
// options sit at each price. The bars are drawn from the placeholder data for now.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../theme/theme.dart';
import '../../domain/refine_bar.dart';

/// The histogram of price bars.
class RefineHistogram extends StatelessWidget {
  /// Creates a histogram of [bars], left to right.
  const RefineHistogram({super.key, required this.bars});

  /// The bars to draw.
  final List<RefineBar> bars;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Padding(
      padding: const EdgeInsets.only(top: IgongoSpace.sm),
      child: SizedBox(
        height: 40,
        // Step 1: each bar takes an equal share of the width and stands on the bottom line.
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.end,
          spacing: IgongoSpace.xs,
          children: [
            for (final bar in bars)
              Expanded(
                child: FractionallySizedBox(
                  heightFactor: bar.fraction,
                  alignment: Alignment.bottomCenter,
                  // Step 2: amber bars at the edges, Igongo red in the middle, each as strong as its opacity says.
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      color: (bar.accent ? palette.accent : palette.primary).withValues(alpha: bar.opacity),
                      borderRadius: const BorderRadius.vertical(top: Radius.circular(IgongoRadius.sm)),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
