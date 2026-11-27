// A card for one highlight on an onboarding screen: an icon in a soft red
// circle, an optional small eyebrow, a title, a line of text, and an optional
// trailing item such as a time. Uses the app's one shared card.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';
import '../../../../../shared/ui/card/igongo_card.dart';

/// One highlight card.
class OnboardingInfoCard extends StatelessWidget {
  /// Creates the card. [eyebrow] and [trailing] are optional.
  const OnboardingInfoCard({
    super.key,
    required this.icon,
    required this.title,
    required this.body,
    this.eyebrow,
    this.trailing,
  });

  /// The icon in the red circle.
  final IconData icon;

  /// The title of the highlight.
  final String title;

  /// One or two lines under the title.
  final String body;

  /// A small upper-case line above the title, if any.
  final String? eyebrow;

  /// An item at the right end of the card, if any, such as opening hours.
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: the icon in a soft red circle, from the theme's primary container.
    final badge = Container(
      padding: const EdgeInsets.all(IgongoSpace.sm),
      decoration: BoxDecoration(color: p.primaryContainer, shape: BoxShape.circle),
      child: Icon(icon, size: IgongoSpace.xl, color: p.primary),
    );
    // Step 2: the words in a column, with the eyebrow only when there is one.
    final words = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: IgongoSpace.xxs,
      children: [
        if (eyebrow != null)
          Text(eyebrow!.toUpperCase(), style: context.text.labelSmall?.copyWith(color: p.primaryText)),
        Text(title, style: context.text.titleMedium?.copyWith(color: p.text)),
        Text(body, style: context.text.bodyLarge?.copyWith(color: p.textMuted)),
      ],
    );
    // Step 3: icon, words and the optional trailing item in one row, inside the shared card.
    return IgongoCard(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        spacing: IgongoSpace.md,
        children: [
          badge,
          Expanded(child: words),
          ?trailing,
        ],
      ),
    );
  }
}
