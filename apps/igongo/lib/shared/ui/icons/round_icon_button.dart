// A round icon button for the top row of the guest home (search, bell).
// It is one soft cream disc with a red icon in the middle, and an optional small
// red dot in the corner for new alerts. Sizes and colours come from the theme tokens only.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';

/// A round icon button: a cream disc with an Igongo-red icon, used wherever a top row needs one.
class RoundIconButton extends StatelessWidget {
  /// Creates the button. [showDot] adds the small red alert dot in the top-right corner.
  const RoundIconButton({
    super.key,
    required this.icon,
    required this.tooltip,
    required this.onPressed,
    this.showDot = false,
  });

  /// The icon drawn in the middle of the disc.
  final IconData icon;

  /// The text read aloud and shown on long press.
  final String tooltip;

  /// Called when the button is tapped.
  final VoidCallback onPressed;

  /// True shows a small alert dot in the corner (for example, new notifications).
  final bool showDot;

  /// The diameter of the round disc in logical pixels. Every round button uses this one size.
  static const double size = 40;

  /// The icon's size in logical pixels: one token, so every round button matches.
  static const double iconSize = IgongoSpace.xl;

  @override
  Widget build(BuildContext context) {
    // Step 0: the theme colours for this mode (light or dark).
    final p = context.palette;
    return IconButton(
      tooltip: tooltip,
      onPressed: onPressed,
      // Step 1: the disc is the surface-alt colour, with no outline, so the red icon stands out.
      icon: SizedBox(
        width: size,
        height: size,
        child: DecoratedBox(
          decoration: BoxDecoration(color: p.surfaceAlt, shape: BoxShape.circle),
          // Step 2: the icon in the middle, and the alert dot in the corner when asked for.
          child: Stack(
            alignment: Alignment.center,
            children: [
              Icon(icon, size: iconSize, color: p.primary),
              if (showDot)
                Positioned(
                  top: IgongoSpace.xs,
                  right: IgongoSpace.xs,
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      color: p.primary,
                      shape: BoxShape.circle,
                      border: Border.all(color: p.surfaceAlt, width: IgongoSpace.xxs),
                    ),
                    child: const SizedBox(width: IgongoSpace.sm, height: IgongoSpace.sm),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
