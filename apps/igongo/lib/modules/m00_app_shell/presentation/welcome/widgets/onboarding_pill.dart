// A small rounded label used on the onboarding screens: the step counter, the
// language, and the tags on the hero photo. It is a plain label unless it is
// given an action, in which case it ripples when tapped.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';

/// A pill with an optional leading icon, a label and an optional trailing icon.
class OnboardingPill extends StatelessWidget {
  /// Creates a pill showing [label]. Give [onTap] to make it tappable.
  /// [onDark] gives the light style used on photos; [brand] gives the red style.
  const OnboardingPill({
    super.key,
    required this.label,
    this.icon,
    this.trailingIcon,
    this.onTap,
    this.onDark = false,
    this.brand = false,
  });

  /// The words in the pill.
  final String label;

  /// An optional icon before the words.
  final IconData? icon;

  /// An optional icon after the words, such as a drop-down arrow.
  final IconData? trailingIcon;

  /// What happens on tap, if anything.
  final VoidCallback? onTap;

  /// Whether the pill sits on a photo, so it gets the light, see-through style.
  final bool onDark;

  /// Whether the pill is filled with the brand red, with white words.
  final bool brand;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: pick the fill and the words' colour for the style: red, light on a photo, or plain.
    final fill = brand ? p.primary : (onDark ? p.surface.withValues(alpha: 0.92) : p.surface);
    final ink = brand ? p.onPrimary : p.text;
    final iconColor = brand ? p.onPrimary : p.primary;
    // Step 2: the words with the icons, in the small label size from the tokens.
    final content = Container(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.md, vertical: IgongoSpace.sm),
      decoration: ShapeDecoration(color: fill, shape: const StadiumBorder()),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        spacing: IgongoSpace.xs,
        children: [
          if (icon != null) Icon(icon, size: IgongoSpace.lg, color: iconColor),
          Text(label, style: context.text.labelLarge?.copyWith(color: ink)),
          if (trailingIcon != null) Icon(trailingIcon, size: IgongoSpace.lg, color: iconColor),
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
