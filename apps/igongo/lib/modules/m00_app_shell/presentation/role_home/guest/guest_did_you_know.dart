// The "Did you know?" card at the foot of the guest home: a short heritage story
// in a warm card with a small icon disc. The story text is a placeholder until the
// hotel sends its own.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';

/// The heritage story card.
class GuestDidYouKnow extends StatelessWidget {
  /// Creates the card.
  const GuestDidYouKnow({super.key});

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Container(
      padding: const EdgeInsets.all(IgongoSpace.lg),
      decoration: BoxDecoration(
        // Step 1: a warm card in the theme's cream tones, with a soft border.
        gradient: LinearGradient(colors: [p.warmCream, p.warmCard]),
        borderRadius: BorderRadius.circular(IgongoSpace.xl),
        border: Border.all(color: p.border),
      ),
      // Step 2: the text on the left, the icon disc on the right.
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'DID YOU KNOW?',
                  style: context.text.labelSmall?.copyWith(
                    color: p.primaryText,
                    letterSpacing: 1.1,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: IgongoSpace.xxs),
                Text(
                  'Story coming soon',
                  style: context.text.titleSmall?.copyWith(color: p.primary, fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: IgongoSpace.xxs),
                Text(
                  'The hotel will share its heritage stories here.',
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: context.text.bodySmall?.copyWith(color: p.textMuted),
                ),
                const SizedBox(height: IgongoSpace.sm),
                // The link is a placeholder: it opens nothing until the stories are wired.
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'Read more',
                      style: context.text.labelMedium?.copyWith(color: p.primaryText, fontWeight: FontWeight.w700),
                    ),
                    const SizedBox(width: IgongoSpace.xxs),
                    Icon(Icons.arrow_forward, size: IgongoSpace.md, color: p.primaryText),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(width: IgongoSpace.md),
          // Step 3: the icon disc, in the brand red.
          DecoratedBox(
            decoration: BoxDecoration(color: p.primaryContainer, shape: BoxShape.circle),
            child: Padding(
              padding: const EdgeInsets.all(IgongoSpace.md),
              child: Icon(Icons.auto_stories_outlined, size: IgongoSpace.xl, color: p.primary),
            ),
          ),
        ],
      ),
    );
  }
}
