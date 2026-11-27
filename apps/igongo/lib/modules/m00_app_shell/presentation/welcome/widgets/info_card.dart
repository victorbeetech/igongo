// A card for one highlight on an onboarding screen. It has a leading icon (or
// a thumbnail), a title with an optional small tag, a line of text, and
// optional trailing items such as opening hours or a chevron. It can stack its
// icon above the words for side-by-side cards. Uses the app's one shared card.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';
import '../../../../../shared/ui/card/igongo_card.dart';

/// One highlight card.
class OnboardingInfoCard extends StatelessWidget {
  /// Creates the card. Give [thumbnail] to show a picture instead of the icon.
  /// [stacked] puts the icon above the words, for cards side by side.
  const OnboardingInfoCard({
    super.key,
    required this.icon,
    required this.title,
    required this.body,
    this.tag,
    this.trailing,
    this.chevron = false,
    this.stacked = false,
    this.thumbnail,
  });

  /// The icon in the red square.
  final IconData icon;

  /// The title of the highlight.
  final String title;

  /// One or two lines under the title.
  final String body;

  /// A small tag shown after the title, if any.
  final String? tag;

  /// An item at the right end of the card, if any, such as opening hours.
  final Widget? trailing;

  /// Whether a chevron shows at the right end, as a sign the card opens something.
  final bool chevron;

  /// Whether the icon sits above the words instead of beside them.
  final bool stacked;

  /// A picture to show in place of the icon, if any.
  final Widget? thumbnail;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: the icon in a soft red rounded square, or the thumbnail picture when given.
    final leading = thumbnail ??
        Container(
          padding: const EdgeInsets.all(IgongoSpace.sm),
          decoration: BoxDecoration(color: p.primaryContainer, borderRadius: BorderRadius.circular(IgongoRadius.md)),
          child: Icon(icon, size: IgongoSpace.xl, color: p.primary),
        );
    // Step 2: the title, with the small tag beside it when there is one.
    final titleLine = Row(
      mainAxisSize: MainAxisSize.min,
      spacing: IgongoSpace.sm,
      children: [
        Flexible(child: Text(title, style: context.text.titleMedium?.copyWith(color: p.text))),
        if (tag != null)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xxs),
            decoration: BoxDecoration(color: p.surfaceAlt, borderRadius: BorderRadius.circular(IgongoRadius.pill)),
            child: Text(tag!, style: context.text.labelSmall?.copyWith(color: p.primaryText)),
          ),
      ],
    );
    // Step 3: the title, then the body text, in a column aligned to the start.
    final words = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: IgongoSpace.xxs,
      children: [
        titleLine,
        Text(body, style: context.text.bodyLarge?.copyWith(color: p.textMuted)),
      ],
    );
    // Step 4: stacked cards put the icon on top; otherwise the icon sits beside the words.
    if (stacked) {
      return IgongoCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: IgongoSpace.sm,
          children: [leading, words],
        ),
      );
    }
    // Step 5: icon, words, then the optional trailing item and chevron, in one row inside the shared card.
    return IgongoCard(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        spacing: IgongoSpace.md,
        children: [
          leading,
          Expanded(child: words),
          ?trailing,
          if (chevron) Icon(Icons.chevron_right, size: IgongoSpace.xl, color: p.textMuted),
        ],
      ),
    );
  }
}
