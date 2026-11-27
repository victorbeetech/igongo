// The page dots under the content of an onboarding screen. The dot for the
// screen showing is a long red pill; the others are small grey dots.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';

/// Shows [count] dots, with the one for [index] drawn long and red.
class OnboardingDots extends StatelessWidget {
  /// Creates the dots. [index] is the screen showing, counted from 0.
  const OnboardingDots({super.key, required this.count, required this.index});

  /// How many screens there are.
  final int count;

  /// The screen showing, counted from 0.
  final int index;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: with reduce motion on, the dot changes at once instead of sliding.
    final still = MediaQuery.disableAnimationsOf(context);
    // Step 2: one dot per screen; the screen showing is the stretched red one.
    return Semantics(
      label: 'Screen ${index + 1} of $count',
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        spacing: IgongoSpace.xs,
        children: [
          for (var i = 0; i < count; i++)
            AnimatedContainer(
              duration: Duration(milliseconds: still ? 0 : IgongoMotion.standard.round()),
              width: i == index ? IgongoSpace.xl : IgongoSpace.sm,
              height: IgongoSpace.sm,
              decoration: BoxDecoration(
                color: i == index ? p.primary : p.border,
                borderRadius: BorderRadius.circular(IgongoRadius.pill),
              ),
            ),
        ],
      ),
    );
  }
}
