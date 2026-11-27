// The two small chips laid over the hero picture: the place (with a pin) at the
// top left, and the theme label (with a star) above the page dots.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../theme/theme.dart';

/// The place chip at the top of the hero.
class HeroPlaceChip extends StatelessWidget {
  /// Creates the chip with [text].
  const HeroPlaceChip({super.key, required this.text});

  /// The place name.
  final String text;

  @override
  Widget build(BuildContext context) => _HeroChip(icon: Icons.place_outlined, text: text);
}

/// The theme chip over the hero, above the page dots.
class HeroThemeChip extends StatelessWidget {
  /// Creates the chip with [text].
  const HeroThemeChip({super.key, required this.text});

  /// The theme words.
  final String text;

  @override
  Widget build(BuildContext context) => _HeroChip(icon: Icons.star_outline, text: text, filled: true);
}

/// A rounded chip with an icon and words. [filled] uses the red primary instead of the surface.
class _HeroChip extends StatelessWidget {
  /// Creates the chip.
  const _HeroChip({required this.icon, required this.text, this.filled = false});

  /// The icon before the words.
  final IconData icon;

  /// The words.
  final String text;

  /// True for the red chip; false for the light chip.
  final bool filled;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final ink = filled ? p.onPrimary : p.text;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xs),
      decoration: BoxDecoration(
        color: filled ? p.primary : p.surface.withValues(alpha: 0.92),
        borderRadius: BorderRadius.circular(IgongoRadius.pill),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        spacing: IgongoSpace.xs,
        children: [
          Icon(icon, size: 14, color: ink),
          Text(text, style: context.text.labelSmall?.copyWith(color: ink), maxLines: 1),
        ],
      ),
    );
  }
}
