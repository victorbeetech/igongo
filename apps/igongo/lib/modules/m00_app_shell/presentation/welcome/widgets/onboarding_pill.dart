// A small rounded label used on the onboarding screens: the step counter, the
// language and the tags on the hero photo. It is a plain label unless it is
// given an action, in which case it ripples when tapped.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';

/// A pill with an optional icon and a label.
class OnboardingPill extends StatelessWidget {
  /// Creates a pill showing [label]. Give [onTap] to make it tappable.
  const OnboardingPill({super.key, required this.label, this.icon, this.onTap, this.onDark = false});

  /// The words in the pill.
  final String label;

  /// An optional icon before the words.
  final IconData? icon;

  /// What happens on tap, if anything.
  final VoidCallback? onTap;

  /// Whether the pill sits on a photo, so it gets the light, see-through style.
  final bool onDark;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: on a photo the pill is nearly opaque white, so the words read on any picture.
    final fill = onDark ? p.surface.withValues(alpha: 0.92) : p.surface;
    // Step 2: the words and the icon, in the small label size from the tokens.
    final content = Container(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.md, vertical: IgongoSpace.sm),
      decoration: ShapeDecoration(color: fill, shape: const StadiumBorder()),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        spacing: IgongoSpace.xs,
        children: [
          if (icon != null) Icon(icon, size: IgongoSpace.lg, color: p.primary),
          Text(label, style: context.text.labelLarge?.copyWith(color: p.text)),
        ],
      ),
    );
    // Step 3: a plain label when there is no action.
    if (onTap == null) return content;
    // Step 4: a tappable pill ripples inside its rounded shape.
    return Material(
      color: p.surface.withValues(alpha: 0),
      child: InkWell(customBorder: const StadiumBorder(), onTap: onTap, child: content),
    );
  }
}
