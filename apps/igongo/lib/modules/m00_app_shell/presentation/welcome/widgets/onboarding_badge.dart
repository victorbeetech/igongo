// A small white card on a hero photo that highlights one feature, such as
// Instant MoMo. It has an icon, a title and an optional line under it.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';

/// A feature badge for the hero photo.
class OnboardingBadge extends StatelessWidget {
  /// Creates a badge with [icon] and [title]; [subtitle] is optional.
  const OnboardingBadge({super.key, required this.icon, required this.title, this.subtitle});

  /// The icon at the start of the badge.
  final IconData icon;

  /// The badge's main words.
  final String title;

  /// An optional line under the title.
  final String? subtitle;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: the card, white and rounded, with the icon and the words side by side.
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.md, vertical: IgongoSpace.sm),
      decoration: BoxDecoration(
        color: p.surface.withValues(alpha: 0.95),
        borderRadius: BorderRadius.circular(IgongoRadius.md),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        spacing: IgongoSpace.sm,
        children: [
          Icon(icon, size: IgongoSpace.xl, color: p.primary),
          // Step 2: the title, with the subtitle under it when there is one.
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: context.text.labelLarge?.copyWith(color: p.text)),
              if (subtitle != null) Text(subtitle!, style: context.text.bodySmall),
            ],
          ),
        ],
      ),
    );
  }
}
